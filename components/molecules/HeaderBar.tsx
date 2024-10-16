import { Header } from '../atoms/Header'

export const HeaderBar: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex justify-between items-center mb-6">
    <Header title={title} />
    <div className='text-black'
    >Hello Admin! 👋</div>
  </div>
)