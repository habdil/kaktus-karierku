import React, { useState } from 'react'
import { Dialog, DialogFooter, DialogHeader, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatbotModalProps {
    isOpen: boolean
    onClose: () => void
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<string[]>([])

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, message])
            setMessage('')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent>
                <DialogHeader>
                    <h2 className='text-xl font-semibold leading-none tracking-tight'>Tanya Kami</h2>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 mt-4">
                    <div className="flex-1 overflow-y-auto border p-2 rounded-md h-64">
                        {messages.length === 0 ? (
                            <p className="text-gray-500">Belum ada pesan.</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="p-2 bg-gray-100 rounded-md mb-2">
                                    {msg}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex gap-x-2">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ketik pesan..."
                            className='focus:ring-0 focus:border-none flex-1'
                        />
                        <DialogFooter>
                            <Button onClick={handleSendMessage} className='text-white bg-primary-600 shadow-sm hover:bg-primary-700 transition-all duration-300'>
                                Send
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    )
}

export default ChatbotModal