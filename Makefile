NAME ?= weatherize-profile

setup:
	npm install

build: setup
	npm run build

watch: setup
	npm run watch

cron-setup: build
	cp .env lib/
	@echo "Add this to your crontab (will open in 10 sec):\n*/15 * * * * $(shell pwd)/bin/weatherize"
	@sleep 10
	crontab -e

prepare: build
	rm -f wx.zip
	mkdir -p dist
	cp -r lib/ dist/
	cp .env dist/
	cp package.json dist/
	cd dist/ ; \
		npm install --only=production ; \
		npm prune --production ; \
		zip -r ../wx.zip * .env

	rm -rf dist/

aws-publish:
	# requires the ROLE is set
ifndef ROLE
	$(error ROLE is not set)
endif

	make prepare

	# create the function and save the ARN for later
	$(eval FN_ARN := $(shell aws lambda create-function \
		--function-name $(NAME) \
		--runtime nodejs4.3 \
		--zip-file fileb://wx.zip \
		--handler index.handler \
		--profile default \
		--role $(ROLE) | jq .FunctionArn --raw-output))

	# create our trigger rule to update every 15min
	$(eval EVENT_ARN := $(shell aws events put-rule \
	  --name rate-15-minutes \
	  --schedule-expression "rate(15 minutes)" | jq .RuleArn --raw-output))

  # Add permissions for event
	aws lambda add-permission \
    --function-name $(NAME) \
		--statement-id EventTriggering \
		--action 'lambda:InvokeFunction' \
		--principal events.amazonaws.com \
		--source-arn $(EVENT_ARN)

	# target our function with the newly created trigger
	aws events put-targets \
		--rule rate-15-minutes \
		--targets="[{\"Arn\": \"$(FN_ARN)\", \"Id\": \"$(NAME)\"}]"

aws-update: prepare
	aws lambda update-function-code \
	--function-name $(NAME) \
	--zip-file fileb://wx.zip \
	--profile default

aws-clean:
	aws lambda delete-function --function-name $(NAME)
	aws events delete-rule --name rate-15-minutes

run:
	./bin/weatherize
