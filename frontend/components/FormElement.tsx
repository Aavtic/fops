"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { useFieldArray, useFormContext } from "react-hook-form"

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
  const { fields, append } = useFieldArray({
    control,
    name: "input_output",
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            placeholder="Input"
            {...register(`input_output.${index}.input` as const)}
          />
          <Input
            placeholder="Output"
            {...register(`input_output.${index}.output` as const)}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ input: "", output: "" })}
      >
        Add
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
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    console.log(JSON.stringify(data));

    fetch("http://localhost:3000/api/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Fibonacci" {...field} />
              </FormControl>
              <FormDescription>
              This will be the title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Give a brief description about the problem, Markdown is recommended"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
              This will be the description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField control={form.control} name="function_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Function Name</FormLabel>
              <FormControl>
                <Input placeholder="fibonacci" {...field} />
              </FormControl>
              <FormDescription>
              This will be the function name 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        
        <FormField
          control={form.control}
          name="input_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      {[
                        "Integer",
                        "Float",
                        "Boolean",
                        "String",
                        "List[int]",
                        "List[float]",
                        "List[Boolean]",
                        "List[String]",
                      ].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Type of function parameter
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
              <FormLabel>Output Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      {[
                        "Integer",
                        "Float",
                        "Boolean",
                        "String",
                        "List[int]",
                        "List[float]",
                        "List[Boolean]",
                        "List[String]",
                      ].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Type of function output
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="input_output"
          render={() => (
            <FormItem>
              <FormLabel>Input and Output</FormLabel>
              <FormControl>
                <InputOutputButtonGroup />
              </FormControl>
              <FormDescription>Define multiple input/output examples</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />



        <Button variant="outline" type="submit">Submit</Button>
      </form>
    </Form>
  )
}
