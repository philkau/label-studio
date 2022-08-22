from pythonjsonlogger import jsonlogger
from label_studio.core.current_request import get_current_request


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        request_id = None
        request = get_current_request()
        if request and hasattr(request, 'request_id'):
            request_id = request.request_id
        log_record['request_id'] = request_id
