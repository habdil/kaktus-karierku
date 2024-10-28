"use client"
import React from 'react'
import ChatbotModal from './ChatbotModal'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";


const ChatbotButton = () => {

    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    return (
        <>
            <div className="fixed bottom-10 right-10">
                <button className='px-4 py-4 rounded-full bg-primary-600 shadow-sm hover:bg-primary-700 transition-all duration-300' onClick={handleOpenModal}>
                    <IoChatbubbleEllipsesOutline className='text-white text-2xl' />
                </button>
                <ChatbotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </>
    )
}

export default ChatbotButton