module.exports = function handler(req, res) {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A fully responsive e-commerce website with product management and payment integration.",
      category: "web",
      tags: ["HTML/CSS", "JavaScript", "PHP"],
      imageUrl: "/images/projects/ecommerce.jpg",
      liveUrl: "https://sachitasigdel.com.np/ecommerce",
      githubUrl: "https://github.com/Sachita92/Ecommerce-website"
    },
    {
      id: 2,
      title: "PredictDuel",
      description: "A social prediction market platform built on Solana blockchain, enabling users to create and participate in prediction markets with real-time data synchronization and on-chain transactions.",
      category: "web",
      tags: ["Solana", "React", "Next.js", "TypeScript", "Web3"],
      imageUrl: "/images/projects/predictduel.jpg",
      liveUrl: "https://predictduel-vxdh.vercel.app/",
      githubUrl: "https://github.com/Sachita92/predictduel"
    },
    {
      id: 3,
      title: "AI Customer Support Chatbot",
      description: "An intelligent chatbot that handles customer inquiries using NLP.",
      category: "ai",
      tags: ["Python", "NLP"],
      imageUrl: "/images/projects/aichatbot.jpg",
      liveUrl: "https://huggingface.co/spaces/sachita/chatbot",
      githubUrl: "https://github.com/Sachita98/ai-chatbot"
    }
  ];
  
  return res.status(200).json(projects);
}

