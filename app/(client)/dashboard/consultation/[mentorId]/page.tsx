import { FeatureMaintenance } from "@/components/shared/FeatureMaintanace";

// app\(client)\dashboard\consultation\[mentorId]\page.tsx
const ConsultationClientId = () => {
    return ( 
        <div className="flex justify-center items-center h-screen">
        <FeatureMaintenance
            title="Tahap Pengambangan"
            description="Kami sedang mengembangkan fitur ini untuk memperbaiki dan meningkatkan kualitas layanan kami."
        />
    </div>
     );
}
 
export default ConsultationClientId;