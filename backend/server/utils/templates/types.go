package templates

// "Integer",
// "Float",
// "Boolean",
// "String",
// "List[int]",
// "List[float]",
// "List[bool]",
// "List[str]",

const (
	Integer string = "Integer"
	Boolean string = "Boolean"
	String string = "String"
	Float string = "Float"
	ListOfInt = "List[int]"
	ListOfBoolean = "List[bool]"
	ListOfStr = "List[str]"
	ListOfFloat = "List[float]"
)

func ToPythonType(Type string) string {
	switch (Type) {
	case Integer:
		return "int"
	case Boolean:
		return "bool"
	case String:
		return "str"
	case Float:
		return "float"
	case ListOfInt:
		return "list[int]"
	case ListOfBoolean:
		return "list[bool]"
	case ListOfStr:
		return "list[str]"
	case ListOfFloat:
		return "list[float]"
	default:
		return ""
	}
}
