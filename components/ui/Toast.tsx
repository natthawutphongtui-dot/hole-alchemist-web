"use client"

import { useEffect, useState } from "react"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: "bg-gray-900 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  }

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg ${colors[type]} animate-fade-in`}>
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
        {icons[type]}
      </span>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-xs">✕</button>
    </div>
  )
}