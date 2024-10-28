import React, { useState } from 'react'
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogPortal } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatbotModalProps {
    isOpen: boolean
    onClose: () => void
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('')

    const handleSendMessage = () => {
        console.log('Message sent:', message)
        setMessage('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}  >

            <DialogContent >
                <DialogHeader >
                    <h2 className='text-xl font-semibold leading-none tracking-tight'>Tanya Kami</h2>
                </DialogHeader>
                <div className="flex gap-x-2 mt-4">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className='focus:ring-0 focus:border-none flex-1 '

                    />
                    <DialogFooter>
                        <Button onClick={handleSendMessage} className='text-white bg-primary-600 shadow-sm hover:bg-primary-700 transition-all duration-300'>
                            Send
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>

        </Dialog>
    )
}

export default ChatbotModal