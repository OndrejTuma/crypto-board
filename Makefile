.PHONY: production local
.DEFAULT_GOAL := local

TARGET := $(filter-out production,$(MAKECMDGOALS))
TARGET := $(filter-out local,$(TARGET))

production:
	$(MAKE) -C setup/production $(TARGET)

local:
	$(MAKE) -C setup/local $(TARGET)

### catch all
%:
	@echo $@
