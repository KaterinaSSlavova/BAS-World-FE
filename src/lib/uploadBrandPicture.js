import { supabase } from "./supabase";

export async function uploadBrandPicture(file) {
    const ext = file.name.split(".").pop();
    const fileName = `brand-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
        .from("brand-pictures")                        // replace "brands" with your actual bucket name
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from("brand-pictures")                        // same bucket name here
        .getPublicUrl(fileName);

    return data.publicUrl;                     // this is the URL you save to your brand record
}