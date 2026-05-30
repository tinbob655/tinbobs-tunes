export default async function toDataUri(url: string): Promise<string> {
    try {
        const blob:Blob = await fetch(url).then(r => r.blob());
        return new Promise((resolve, reject):void => {
            const reader = new FileReader();
            reader.onload  = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    //fallback
    catch {
        return url;
    }
}