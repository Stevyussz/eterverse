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
    // Strictly use session.user.id (ObjectId from MongoDBAdapter) to prevent CastError
    const ownerIdentifier = session?.user?.id;
    if (!ownerIdentifier) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const serverType = (formData.get("serverType") as 'SERVER' | 'REALM') || 'SERVER';
    const platform = (formData.get("platform") as 'JAVA' | 'BEDROCK' | 'CROSSPLAY') || 'CROSSPLAY';
    const realmCodeRaw = (formData.get("realmCode") as string) || "";
    const realmCode = realmCodeRaw.replace(/^https?:\/\/realms\.gg\//, "").trim();

    let ipAddress = (formData.get("ipAddress") as string) || "";
    let port = parseInt(formData.get("port") as string) || 25565;
    let bedrockPort = parseInt(formData.get("bedrockPort") as string) || 19132;

    if (serverType === 'REALM') {
      ipAddress = realmCode ? `realms.gg/${realmCode}` : "realms.gg";
      port = 19132;
    }

    const description = formData.get("description") as string;
    const tags = (formData.get("tags") as string).split(",").map(t => t.trim());
    const videoUrl = formData.get("videoUrl") as string;
    const logoUrl = formData.get("logoUrl") as string || "";
    const bannerUrl = formData.get("bannerUrl") as string || "";
    
    const galleryUrlsRaw = formData.get("galleryUrls") as string;
    const galleryUrls = galleryUrlsRaw ? galleryUrlsRaw.split(",").map(url => url.trim()).filter(url => url.length > 0) : [];

    const discordUrl = formData.get("discordUrl") as string || "";
    const whatsappUrl = formData.get("whatsappUrl") as string || "";
    const telegramUrl = formData.get("telegramUrl") as string || "";
    const websiteUrl = formData.get("websiteUrl") as string || "";
    const ownerWhatsApp = formData.get("ownerWhatsApp") as string;

    await connectToDatabase();
    
    const newServer = new Server({
      name,
      serverType,
      platform,
      realmCode,
      ipAddress,
      port,
      bedrockPort,
      description,
      tags,
      videoUrl,
      logoUrl,
      bannerUrl,
      galleryUrls,
      socialLinks: {
        discord: discordUrl,
        whatsapp: whatsappUrl,
        telegram: telegramUrl,
        website: websiteUrl,
      },
      ownerId: ownerIdentifier,
      ownerWhatsApp,
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
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">Daftarkan Server</h1>
        <p className="text-zinc-400 font-body mt-1 text-sm">Lengkapi rincian formulir di bawah ini. Tim kurasi kami akan meninjau server Anda sebelum tampil di direktori publik.</p>
      </header>
      
      <div className="bg-zinc-950/70 border border-zinc-800 p-6 sm:p-8 shadow-xl rounded-2xl">
        <ServerSubmitForm action={createServer} />
      </div>
    </div>
  );
}
