'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'agent'
  time: string
}

const AUTO_RESPONSES = [
  "Thanks for reaching out! How can I help you with our FiveM scripts today?",
  "Great question! All our scripts support ESX and QBCore frameworks. Which one are you using?",
  "Yes, we offer lifetime updates on all purchases. You'll get notifications when new versions are released.",
  "Our support team is available 24/7 on Discord, but I'm happy to help you right here too!",
  "We have a 30% bundle discount when you buy 3+ featured scripts. Would you like to know more?",
  "All scripts are delivered instantly after purchase to your email. No waiting required!",
  "I can help with installation questions too. What seems to be the issue?",
  "Feel free to join our Discord for more detailed support — our devs are very active there!",
]

let messageIdCounter = 0

export function LiveChatWidget() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      text: 'Hi there! 👋 Welcome to RLE Studios. How can I help you today?',
      sender: 'agent',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const responseIndex = useRef(0)

  // Show unread indicator after 10 seconds if chat hasn't been opened
  useEffect(() => {
    if (open) {
      setUnread(false)
      return
    }
    const timer = setTimeout(() => setUnread(true), 10000)
    return () => clearTimeout(timer)
  }, [open])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: ++messageIdCounter,
      text: trimmed,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate agent response after delay
    setTimeout(() => {
      setTyping(false)
      const response = AUTO_RESPONSES[responseIndex.current % AUTO_RESPONSES.length]
      responseIndex.current++
      const agentMsg: ChatMessage = {
        id: ++messageIdCounter,
        text: response,
        sender: 'agent',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, agentMsg])
    }, 1500 + Math.random() * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="accent-gradient text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Headphones className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-semibold text-sm">RLE Studios Support</p>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-background border-border rounded-lg h-9 text-xs"
              />
              <Button
                size="icon"
                className="btn-gradient-slide btn-gradient-slide-sm rounded-lg h-9 w-9 shrink-0"
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground text-center mt-1.5">
              Powered by RLE Studios · Avg response: &lt; 2 min
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full accent-gradient text-white shadow-lg glow-gradient hover:scale-110 transition-all flex items-center justify-center group"
        aria-label={open ? 'Close chat' : 'Open live chat'}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                1
              </span>
            )}
            <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20 group-hover:opacity-0" />
          </>
        )}
      </button>
    </>
  )
}
