## Types
# 1. Integer
# 2. Boolean
# 3. String
# 4. Float
# 5. ListOfInt
# 6. ListOfBoolean
# 7. ListOfStr
# 8. ListOfFloat


class CouldNotConvertToPythonType(Exception):
    def __init__(self, type, value):
        self.type = type
        self.value = value
    def to_string(self):
        return f"Could not convert {self.value} to type {self.type}"



class PYTypes:
    def getPythonType(self, type: str, value):
        match type:
            case "Integer":
                try:
                    return int(value)
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "Boolean":
                try:
                    return True if str(value).lower() == "true" else False 
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "String":
                try:
                    return str(value)
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "Float":
                try:
                    return float(value)
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "ListOfInt":
                try:
                    return [int(no) for no in value if no.isdigit()]
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "ListOfBoolean":
                try:
                    return [float(no) for no in value if self.isboolean(no)]
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "ListOfStr":
                ## TODO 
                # Implement ts
                raise CouldNotConvertToPythonType(type, value)
                # try:
                #     return [float(no) for no in value if self.isfloat(no)]
                # except:
                #     raise CouldNotConvertToPythonType(type, value)

            case "ListOfFloat":
                try:
                    return [float(no) for no in value if self.isfloat(no)]
                except:
                    raise CouldNotConvertToPythonType(type, value)
            case _:
                #TODO
                # add better error with msg
                raise CouldNotConvertToPythonType(type, value)

                
    def isfloat(self, no):
        try:
            float(no)
            return True
        except:
            return False

    def isboolean(self, no):
        ## TODO
        # bool(..) returns true for any truthy value
        try:
            bool(no)
            return True
        except:
            return False
