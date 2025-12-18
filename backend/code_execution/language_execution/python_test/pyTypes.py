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

            case "List[int]":
                try:
                    # Silently Ignore wrong values. This should be reported back and enforce a fix
                    return self.convertToListOfInt(value)
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "List[bool]":
                try:
                    return self.convertToListOfBool(value)
                except:
                    raise CouldNotConvertToPythonType(type, value)

            case "List[str]":
                return self.convertToListOfStr(value)
                ## TODO 
                # Implement ts
                raise CouldNotConvertToPythonType(type, value)
                # try:
                #     return [float(no) for no in value if self.isfloat(no)]
                # except:
                #     raise CouldNotConvertToPythonType(type, value)

            case "List[float]":
                try:
                    return self.convertToListOfFloat(value)
                except:
                    raise CouldNotConvertToPythonType(type, value)
            case _:
                #TODO
                # add better error with msg
                raise CouldNotConvertToPythonType(type, value)


    def convertToListOfStr(self, val):
        val = val[1:-1]
        sp = [s.strip()[1:-1] for s in val.split(',')]
        return sp 

    def convertToListOfBool(self, val):
        val = val[1:-1]
        sp = val.split(',')
        return [self.toboolean(b) for b in sp if self.isboolean(b)]

    def convertToListOfInt(self, val):
        val = val[1:-1]
        sp = val.split(',')
        return [int(n) for n in sp if n.strip().isdigit()]

    def convertToListOfFloat(self, val):
        val = val[1:-1]
        sp = val.split(',')
        return [float(n) for n in sp if self.isfloat(n.strip())]
                
    def isfloat(self, no):
        try:
            float(no)
            return True
        except:
            return False

    def toboolean(self, no):
        ## TODO
        # bool(..) returns true for any truthy value
        if no.strip().lower() == "true":
            return True
        else:
            return False

    def isboolean(self, no):
        ## TODO
        # bool(..) returns true for any truthy value
        if no.strip().lower() == "true" or no.strip().lower() == "false":
            return True
        return False
