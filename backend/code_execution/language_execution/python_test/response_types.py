class URCodeErrorLOL(Exception):
    def __init__(self, error: str):
        self.error = error

    def to_string(self):
        # return '{"status": "URCodeErrorLOL", "error": "' + str(self.error) + '"}'
        return '''{
    "status": "URCodeErrorLOL",
    "info": 
        {
            "error": "%s"
        }
}''' % self.error



class Fail(Exception):
    def __init__(self, expected, got, input):
        self.exp = expected
        self.got = got
        self.input = input

    def to_string(self):
        # return '{"status": "URCodeErrorLOL", "error": "' + str(self.error) + '"}'
        return '''
{
        "status": "URCodeErrorLOL",
        "info": {
            "Fail": {
                "ex": "%s",
                "got": "%s",
                "input": "%s"
            }
        }
}''' % (self.exp, self.got, self.input)

class Cooked:
    def __init__(self, error):
        self.error = error

    def to_string(self):
        return '''
{
        "status": "URCodeErrorLOL",
        "info": {
            "Cooked": {
                "error": "%s"
            }
        }
}''' % self.error

class Pass:
    def __init__(self,execution_ms, average_ms, execution_data):
        self.data = execution_data
        self.total_exec_ms = execution_ms
        self.avg_ms = average_ms

    def to_string(self):
        return '''
{
        "status": "Pass",
        "execution_time": 
        "info": {
            "execution_time": "%s"
            "average_time": "%s"
            "Pass": "%s"
        }
}
    ''' % (self.total_exec_ms, self.avg_ms, self.data)
