'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
})

export default function EnhancedLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Di sini Anda dapat menambahkan logika untuk mengirim data login ke server
    console.log(values)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-black">Welcome Back!</CardTitle>
        <CardDescription className="text-center">Masukkan kredensial Anda untuk mengakses akun</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl className="w-full bg-gray-100 border-none rounded-x py-2 px-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0">
                    <Input placeholder="Masukkan email Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Kata Sandi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan kata sandi Anda"
                        {...field}
                        className="w-full bg-gray-100 border-none rounded-x py-2 px-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-sm text-gray-600">
          Lupa kata sandi?
        </Button>
      </CardFooter>
    </Card>
  )
}