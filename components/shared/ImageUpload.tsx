"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { storageService, StorageBucket } from "@/lib/storage/supabase-storage";

interface ImageUploadProps {
 onUploadComplete: (url: string) => void;
 defaultImage?: string; 
 bucket?: StorageBucket;
 path?: string;
}

export function ImageUpload({ 
 onUploadComplete, 
 defaultImage,
 bucket = StorageBucket.EVENT_BANNER,
 path = `uploads/${Date.now()}` 
}: ImageUploadProps) {
 const [isUploading, setIsUploading] = useState(false);
 const [preview, setPreview] = useState(defaultImage);
 const { toast } = useToast();

 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   try {
     const file = e.target.files?.[0];
     if (!file) return;

     setIsUploading(true);

     const { path: filePath, url } = await storageService.uploadFile(
       bucket,
       file,
       { path }
     );

     // Update preview
     setPreview(url);
     onUploadComplete(url);

     toast({
       title: "Success",
       description: "Image uploaded successfully",
     });

   } catch (error) {
     console.error('Upload error:', error);
     toast({
       variant: "destructive",
       title: "Error",
       description: error instanceof Error ? error.message : "Failed to upload image",
     });
   } finally {
     setIsUploading(false);
   }
 };

 const handleDeleteImage = async () => {
   if (!preview) return;

   try {
     const fileName = preview.split('/').pop();
     if (!fileName) return;

     await storageService.deleteFile(
       bucket,
       `${path}/${fileName}`
     );

     setPreview(undefined);
     onUploadComplete('');

     toast({
       title: "Success",
       description: "Image deleted successfully",
     });
   } catch (error) {
     console.error('Delete error:', error);
     toast({
       variant: "destructive",
       title: "Error",
       description: "Failed to delete image",
     });
   }
 };

 return (
   <div className="space-y-4">
     <div className="flex items-center gap-4">
       <Button
         type="button"
         variant="outline"
         disabled={isUploading}
         onClick={() => document.getElementById('image-upload')?.click()}
       >
         <Upload className="h-4 w-4 mr-2" />
         {isUploading ? (
           <>
             <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
             <span className="ml-2">Uploading...</span>
           </>
         ) : (
           'Upload Image'
         )}
       </Button>

       {preview && (
         <Button
           type="button"
           variant="destructive"
           size="sm"
           onClick={handleDeleteImage}
           disabled={isUploading}
         >
           Remove Image
         </Button>
       )}
       
       <input
         id="image-upload"
         type="file"
         accept="image/*"
         className="hidden"
         onChange={handleUpload}
         disabled={isUploading}
       />
     </div>

     {preview && (
       <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border">
         <Image
           src={preview}
           alt="Preview image"
           fill
           className="object-cover"
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           priority
         />
       </div>
     )}
   </div>
 );
}