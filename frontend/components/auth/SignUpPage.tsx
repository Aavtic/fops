"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react'

import { apiPost } from '@/lib/http/client'
import { SignUpEndpoint } from '@/lib/http/endpoints'

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState("error");
    const [isValid, setValid] = useState(true);
    const [form, setForm] = useState({
        username: "",
        email:    "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (form.password !== form.confirmPassword) {
            console.log('here now')
            setValid(false)
            setError("Passwords do not match. Please try again.")
        } else {
            setValid(true)
            setError("");
        }
    }, [form])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}))
    }

    const validateAndSubmit = () => {
        if (form.password !== form.confirmPassword) {
            return
        }

        apiPost(SignUpEndpoint, {
            username: form.username,
            password: form.password,
            email:    form.email,
        })
        .then(response => {
            if (response.status === 200) {
                router.push("/login");
            } else if (response.status === 400 || response.status === 409) {
                response.json()
                .then(json => {
                    setValid(false);
                    const message = typeof json.error === 'object' 
                            ? Object.values(json.error)[0] 
                            : json.error;
                    setError(message || "An unexpected error occurred");
                })
            } else {
                response.json()
                .then(json => console.log("ERROR: ", json))
            }
        })

    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your details to get started</p>
          </div>

          <form className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input 
                name="username"
                onChange={handleChange}
                type="text" 
                placeholder="johndoe"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-transparent dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input 
                name="email"
                onChange={handleChange}
                type="email" 
                placeholder="name@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-transparent dark:text-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                name="password"
                onChange={handleChange}
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-transparent dark:text-white"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input 
                name="confirmPassword"
                onChange={handleChange}
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-transparent dark:text-white"
              />
            </div>

            {/* Error Message Component */}
            {!isValid && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <button 
              type="button" 
              disabled={!isValid}
              onClick={validateAndSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors mt-2"
            >
              Sign Up
            </button>

          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
}
