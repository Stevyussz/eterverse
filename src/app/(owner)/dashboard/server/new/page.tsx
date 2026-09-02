import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { redirect } from "next/navigation";
import { ServerSubmitForm } from "./ServerSubmitForm"; 

export default async function NewServerPage() {
  const session = await auth();

  async function createServer(formData: FormData) {
    "use server";
    
    const session = await auth();
    const ownerIdentifier = session?.user?.email || session?.user?.id;
    if (!ownerIdentifier) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const ipAddress = formData.get("ipAddress") as string;
    const port = parseInt(formData.get("port") as string) || 25565;
    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string).split(",").map(t => t.trim());
    const videoUrl = formData.get("videoUrl") as string;
    const discordUrl = formData.get("discordUrl") as string || "";
    const whatsappUrl = formData.get("whatsappUrl") as string || "";
    const telegramUrl = formData.get("telegramUrl") as string || "";
    const websiteUrl = formData.get("websiteUrl") as string || "";

    await connectToDatabase();
    
    const newServer = new Server({
      name,
      ipAddress,
      port,
      description,
      tags,
      videoUrl,
      socialLinks: {
        discord: discordUrl,
        whatsapp: whatsappUrl,
        telegram: telegramUrl,
        website: websiteUrl,
      },
      ownerId: ownerIdentifier,
      moderationStatus: 'PENDING',
      metrics: { impressions: 0, clicks: 0, votes: 0, rating: 0 },
      liveStatus: { isOnline: false, currentPlayers: 0, maxPlayers: 0, lastChecked: new Date() }
    });

    await newServer.save();
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-3xl font-display font-semibold text-eter-starlight">Submit a Server</h1>
        <p className="text-zinc-500 font-body mt-1">Fill out the details below. Our team will review your submission before it goes live.</p>
      </header>
      
      <div className="bg-[#050505]/60 backdrop-blur-sm border border-white/5 border-l-2 border-l-eter-cyan p-8 shadow-xl rounded-sm">
        <ServerSubmitForm action={createServer} />
      </div>
    </div>
  );
}
