"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { useFieldArray, useFormContext } from "react-hook-form"

import { CreateProblemEndpoint } from '@/lib/http/endpoints'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


function InputOutputButtonGroup() {
    const { control, register } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "input_output",
    })

    return (
        <div className="space-y-2 sm:space-y-3">
            {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center p-2 sm:p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex-1">
                        <Input
                            placeholder="Input (e.g., 5)"
                            className="bg-white h-9 sm:h-10 text-sm"
                            {...register(`input_output.${index}.input` as const)}
                        />
                    </div>
                    <span className="text-slate-400 font-bold text-center sm:text-left hidden sm:block">→</span>
                    <span className="text-slate-400 font-bold text-center sm:hidden">↓</span>
                    <div className="flex-1">
                        <Input
                            placeholder="Expected output"
                            className="bg-white h-9 sm:h-10 text-sm"
                            {...register(`input_output.${index}.output` as const)}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 hover:bg-red-600"
                        title="Remove test case"
                    >
                        ✕
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ input: "", output: "" })}
                className="w-full border-dashed border-2 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all h-10 sm:h-11 text-sm sm:text-base"
            >
                + Add Test Case
            </Button>
        </div>
    )
}


const FormSchema = z.object({
    title: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),

    description: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),

    function_name: z.string().min(1, {
        message: "The function must be atleast 1 character."
    }),

    parameter_name: z.string().min(1, {
        message: "The function must be atleast 1 character."
    }),

    input_type: z.string().min(2, {
        message: "please select atleast one input type.",
    }),

    output_type: z.string().min(2, {
        message: "please select atleast one input type.",
    }),

    input_output: z
        .array(
            z.object({
                input: z.string().min(1, "Input required"),
                output: z.string().min(1, "Output required"),
            })
        )
        .min(1, { message: "Please provide at least one input & output." }),

})


export function InputForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            description: "",
            function_name: "",
            parameter_name: "",
            input_type: "",
            output_type: "",
            input_output: [{ input: "", output: "" }],
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {

        console.log(JSON.stringify(data));

        fetch(CreateProblemEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
            .then((json) => {
                console.log('json is ', json);
                if (json.status === "success") {
                    toast("Problem submitted successfully", {
                        description: (
                            <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                                <h4 className="text-gray-300">Link will be generated soon</h4>
                            </pre>
                        ),
                    })
                } else {
                    toast("Error while submitting problem", {
                        description: (
                            <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                                <h4 className="text-gray-300">{json.status}</h4>
                            </pre>
                        ),
                    })
                }
            });


    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                <div className="space-y-2 border-b pb-3 sm:pb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Create New Problem</h2>
                    <p className="text-sm sm:text-base text-slate-500">Define your coding challenge with test cases</p>
                </div>

                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm sm:text-base font-semibold text-slate-700">Problem Title</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="e.g., Fibonacci Sequence" 
                                className="h-10 sm:h-11 text-sm sm:text-base"
                                {...field} 
                            />
                        </FormControl>
                        <FormDescription className="text-xs sm:text-sm text-slate-500">
                            Give your problem a clear and descriptive title
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />


                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm sm:text-base font-semibold text-slate-700">Problem Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe the problem in detail. You can use Markdown formatting for better readability..."
                                className="resize-none min-h-24 sm:min-h-32 text-sm sm:text-base"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription className="text-xs sm:text-sm text-slate-500">
                            Provide a comprehensive description. Markdown formatting is supported.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <FormField control={form.control} name="function_name" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base font-semibold text-slate-700">Function Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="e.g., fibonacci" 
                                    className="h-10 sm:h-11 font-mono text-sm sm:text-base bg-white"
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm text-slate-500">
                                The name of the function to be implemented
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField control={form.control} name="parameter_name" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base font-semibold text-slate-700">Parameter Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="e.g., n" 
                                    className="h-10 sm:h-11 font-mono text-sm sm:text-base bg-white"
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm text-slate-500">
                                The input parameter for the function
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                        control={form.control}
                        name="input_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base font-semibold text-slate-700">Input Type</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
                                            <SelectValue placeholder="Select input type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="font-semibold text-slate-600 text-xs sm:text-sm">Data Types</SelectLabel>
                                                {[
                                                    "Integer",
                                                    "Float",
                                                    "Boolean",
                                                    "String",
                                                    "List[int]",
                                                    "List[float]",
                                                    "List[bool]",
                                                    "List[str]",
                                                ].map((option) => (
                                                    <SelectItem key={option} value={option} className="cursor-pointer">
                                                        <span className="font-mono text-xs sm:text-sm">{option}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm text-slate-500">
                                    Data type of the function parameter
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="output_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base font-semibold text-slate-700">Output Type</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
                                            <SelectValue placeholder="Select output type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="font-semibold text-slate-600 text-xs sm:text-sm">Data Types</SelectLabel>
                                                {[
                                                    "Integer",
                                                    "Float",
                                                    "Boolean",
                                                    "String",
                                                    "List[int]",
                                                    "List[float]",
                                                    "List[bool]",
                                                    "List[str]",
                                                ].map((option) => (
                                                    <SelectItem key={option} value={option} className="cursor-pointer">
                                                        <span className="font-mono text-xs sm:text-sm">{option}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm text-slate-500">
                                    Data type of the function return value
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="input_output"
                    render={() => (
                        <FormItem className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 rounded-lg border-2 border-blue-200">
                            <FormLabel className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-blue-600">📝</span>
                                Test Cases
                            </FormLabel>
                            <FormControl>
                                <InputOutputButtonGroup />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm text-slate-600 mt-2">
                                Add test cases to validate solutions. Each test case should have an input and expected output.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                    <Button 
                        type="submit" 
                        className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                    >
                        Create Problem
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        onClick={() => form.reset({
                            title: "",
                            description: "",
                            function_name: "",
                            parameter_name: "",
                            input_type: "",
                            output_type: "",
                            input_output: [{ input: "", output: "" }],
                        })}
                    >
                        Reset Form
                    </Button>
                </div>
            </form>
        </Form>
    )
}
