"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  ExternalLink, 
  Globe, 
  SearchCode, 
  Database, 
  AlertTriangle, 
  Wifi, 
  Info,
  X,
  Lock,
  Zap,
  SearchX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// --- Data ---
// ... (omitting data for brevity in target content matching if needed, but I'll use exact match)

const categories = ["Threat Intelligence", "Malware Analysis", "Security Tools", "Cybercrime Reporting", "Learning Hub"];

const allResources = [
  {
    id: 1,
    name: "VirusTotal",
    description: "Multi-engine malware and URL analysis platform",
    icon: ShieldCheck,
    category: "Malware Analysis",
    link: "https://www.virustotal.com/"
  },
  {
    id: 2,
    name: "Google Safe Browsing",
    description: "Detect malicious and phishing websites",
    icon: Globe,
    category: "Malware Analysis",
    link: "https://safebrowsing.google.com/"
  },
  {
    id: 3,
    name: "Nmap",
    description: "Network discovery and vulnerability scanning",
    icon: SearchCode,
    category: "Security Tools",
    link: "https://nmap.org/"
  },
  {
    id: 4,
    name: "Wireshark",
    description: "Network packet analyzer for security monitoring",
    icon: Wifi,
    category: "Security Tools",
    link: "https://www.wireshark.org/"
  },
  {
    id: 5,
    name: "MITRE CVE Database",
    description: "Global catalog of cybersecurity vulnerabilities",
    icon: Database,
    category: "Threat Intelligence",
    link: "https://cve.mitre.org/",
    verified: true
  },
  {
    id: 6,
    name: "National Vulnerability Database",
    description: "US government vulnerability repository",
    icon: Shield,
    category: "Threat Intelligence",
    link: "https://nvd.nist.gov/",
    verified: true
  },
  {
    id: 7,
    name: "CERT-In",
    description: "Indian national cybersecurity incident response team",
    icon: ShieldCheck,
    category: "Cybercrime Reporting",
    link: "https://www.cert-in.org.in/",
    region: "India"
  },
  {
    id: 8,
    name: "Internet Crime Complaint Center (IC3)",
    description: "FBI cybercrime reporting platform",
    icon: ShieldAlert,
    category: "Cybercrime Reporting",
    link: "https://www.ic3.gov/",
    region: "USA"
  },
  {
    id: 9,
    name: "Shodan",
    description: "Search engine for Internet-connected devices",
    icon: Search,
    category: "Security Tools",
    link: "https://www.shodan.io/"
  },
  {
    id: 10,
    name: "Burp Suite",
    description: "Web application security testing platform",
    icon: Lock,
    category: "Security Tools",
    link: "https://portswigger.net/burp"
  }
];

const knowledgeHub = [
  {
    title: "Phishing Attacks",
    shortDesc: "Explanation of phishing techniques",
    fullDesc: "Phishing is a type of social engineering attack often used to steal user data, including login credentials and credit card numbers. It occurs when an attacker, masquerading as a trusted entity, dupes a victim into opening an email, instant message, or text message.",
    prevention: "Always check the sender's email address, avoid clicking on suspicious links, and enable multi-factor authentication.",
    tools: "VirusTotal, Phishing Quiz (Google), Browser Protection filters.",
    icon: AlertTriangle,
    category: "Learning Hub"
  },
  {
    title: "Ransomware",
    shortDesc: "How ransomware encrypts systems",
    fullDesc: "Ransomware is malicious software that infects your computer and displays messages demanding a fee to be paid in order for your system to work again. This class of malware is a criminal moneymaking scheme that can be installed através de links enganosos em mensagens de e-mail, mensagens instantâneas ou sites.",
    prevention: "Maintain regular backups, keep software updated, and use robust endpoint protection.",
    tools: "Malwarebytes, No More Ransom project tools, SentinelOne.",
    icon: Lock,
    category: "Learning Hub"
  },
  {
    title: "SQL Injection",
    shortDesc: "Database exploitation technique",
    fullDesc: "SQL Injection (SQLi) is a type of vulnerability that occurs when an attacker can interfere with the queries that an application makes to its database. It can allow an attacker to view data they are not normally able to retrieve.",
    prevention: "Use prepared statements, input validation, and the principle of least privilege for database accounts.",
    tools: "sqlmap, Burp Suite, OWASP ZAP.",
    icon: Database,
    category: "Learning Hub"
  },
  {
    title: "DDoS Attacks",
    shortDesc: "Distributed denial-of-service attacks",
    fullDesc: "A distributed denial-of-service (DDoS) attack is a malicious attempt to disrupt the normal traffic of a targeted server, service or network by overwhelming the target or its surrounding infrastructure with a flood of Internet traffic.",
    prevention: "Use a content delivery network (CDN), implement rate limiting, and use DDoS mitigation services.",
    tools: "Cloudflare, Akamai, AWS Shield.",
    icon: Zap,
    category: "Learning Hub"
  }
];

const threatDistributionData = [
  { name: "Phishing", value: 40 },
  { name: "Malware", value: 30 },
  { name: "Network Attacks", value: 20 },
  { name: "Other", value: 10 }
];

const toolUsageData = [
  { name: "VirusTotal", usage: 85 },
  { name: "Nmap", usage: 65 },
  { name: "Wireshark", usage: 50 },
  { name: "Burp Suite", usage: 45 }
];

const COLORS = ["#00E5FF", "#7A5CFF", "#00FF9C", "#FF4C4C"];

const recommendedTools = ["VirusTotal", "Nmap", "Shodan", "Burp Suite", "Wireshark"];

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className={`glass border border-border p-5 group transition-all duration-300 hover:border-cyber-blue/50 shadow-premium ${className}`}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="h-1 w-8 bg-cyber-blue rounded-full shadow-[0_0_10px_rgba(0,180,255,0.4)]" />
    <h2 className="text-xl font-bold text-foreground tracking-tight uppercase tracking-[0.1em]">{title}</h2>
  </div>
);

export default function ResourceDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedKnowledge, setSelectedKnowledge] = useState<typeof knowledgeHub[0] | null>(null);

  const filteredResources = useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "All" || resource.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const filteredKnowledge = useMemo(() => {
    if (activeCategory !== "All" && activeCategory !== "Learning Hub") return [];
    return knowledgeHub.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeCategory]);

  const handleOpenResource = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-background grid-background p-6 lg:p-10 space-y-12 pb-20">
      
      {/* --- Header Section --- */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter"
          >
            Resource <span className="text-cyber-blue text-glow-blue">Directory</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl"
          >
            Access trusted cybersecurity tools, threat intelligence sources, and learning resources.
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative group max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-cyber-blue transition-colors shadow-sm" size={20} />
            <input
              type="text"
              placeholder="Search cybersecurity tools, CVEs, databases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all text-sm text-foreground placeholder:text-text-muted/50 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategory(filter)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                  activeCategory === filter 
                    ? "bg-cyber-blue border-cyber-blue text-white shadow-lg shadow-cyber-blue/20" 
                    : "bg-panel-secondary border-border text-text-muted hover:border-cyber-blue hover:text-cyber-blue hover:bg-cyber-blue/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Resources Grid --- */}
      <section>
        <SectionTitle title={activeCategory === "All" ? "All Resources" : activeCategory} />
        
        <AnimatePresence mode="popLayout">
          {filteredResources.length > 0 || filteredKnowledge.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Render Knowledge Hub items first if Learning Hub or All is selected */}
              {filteredKnowledge.map((item, idx) => (
                <div 
                  key={`knowledge-${idx}`} 
                  onClick={() => setSelectedKnowledge(item)}
                  className="cursor-pointer"
                >
                  <Card className="h-full border-neon-purple/30">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-neon-purple/10 rounded-xl text-neon-purple">
                          <item.icon size={24} />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-neon-purple tracking-widest">Learning Hub</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-neon-purple transition-colors">{item.title}</h3>
                      <p className="text-text-secondary text-sm mb-6 flex-grow">{item.shortDesc}</p>
                      <div className="flex items-center text-[10px] text-text-muted font-black uppercase tracking-widest group-hover:text-neon-purple transition-colors">
                        Explore Topic <Info size={10} className="ml-1" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              {/* Render other resources */}
              {filteredResources.map((resource) => (
                <Card key={resource.id}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-cyber-blue/10 rounded-xl text-cyber-blue shadow-sm">
                        <resource.icon size={24} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase font-black text-text-muted tracking-widest">{resource.category}</span>
                        {resource.verified && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-success-green bg-success-green/10 px-1.5 py-0.5 rounded border border-success-green/20 shadow-sm">
                            <ShieldCheck size={8} /> Verified
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-cyber-blue transition-colors">{resource.name}</h3>
                    <p className="text-text-secondary text-sm mb-6 flex-grow">{resource.description}</p>
                    {resource.region && (
                      <span className="text-[10px] text-text-muted font-black mb-4 uppercase tracking-tighter">Region: {resource.region}</span>
                    )}
                    <button 
                      onClick={() => handleOpenResource(resource.link)}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-foreground/5 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-cyber-blue hover:text-white hover:border-cyber-blue transition-all group shadow-sm"
                    >
                      Open Resource
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4 glass border-border shadow-premium"
            >
              <div className="p-6 bg-foreground/5 rounded-full text-text-muted shadow-inner">
                <SearchX size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">No cybersecurity resources found</h3>
                <p className="text-text-secondary max-w-xs mx-auto">Try adjusting your search terms or filter to find what you're looking for.</p>
              </div>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="px-6 py-2 bg-cyber-blue/10 border border-cyber-blue/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyber-blue hover:bg-cyber-blue hover:text-white transition-all shadow-sm"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- Threat Analytics Visualization --- */}
      <section className="border-t border-border/10 pt-12">
        <SectionTitle title="Threat Analytics Overview" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass p-6 min-h-[400px] flex flex-col border border-border shadow-premium"
          >
            <h3 className="text-[10px] font-black text-text-muted mb-6 uppercase tracking-widest text-center">Threat Category Distribution</h3>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {threatDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    itemStyle={{ color: "var(--foreground)", fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass p-6 min-h-[400px] flex flex-col border border-border shadow-premium"
          >
            <h3 className="text-[10px] font-black text-text-muted mb-6 uppercase tracking-widest text-center">Security Tool Usage</h3>
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={toolUsageData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: "bold" }} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: "var(--foreground)", opacity: 0.05 }}
                    contentStyle={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    itemStyle={{ color: "var(--foreground)", fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Bar dataKey="usage" radius={[10, 10, 0, 0]}>
                    {toolUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Top Recommended Tools --- */}
      <section className="border-t border-border/10 pt-10">
        <h3 className="text-[10px] font-black text-text-muted mb-6 uppercase tracking-widest text-center">Top Recommended Tools</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {recommendedTools.map((tool, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, y: -2 }}
              onClick={() => setSearchQuery(tool)}
              className="px-6 py-3 glass border border-border rounded-2xl flex items-center gap-2 cursor-pointer hover:border-cyber-blue transition-all shadow-premium"
            >
              <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
              <span className="text-xs font-black uppercase tracking-tight text-foreground">{tool}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Knowledge Hub Modal --- */}
      <AnimatePresence>
        {selectedKnowledge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-2xl w-full p-8 border border-border relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => setSelectedKnowledge(null)}
                  className="p-2 text-text-muted hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-neon-purple/10 rounded-2xl text-neon-purple shadow-sm">
                  <selectedKnowledge.icon size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">{selectedKnowledge.title}</h2>
                  <span className="text-xs font-black text-neon-purple uppercase tracking-widest">Threat Analysis</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-text-muted mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} className="text-neon-purple" /> Description
                  </h4>
                  <p className="text-text-secondary leading-relaxed font-medium">{selectedKnowledge.fullDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-success-green/5 border border-success-green/10 rounded-2xl shadow-sm">
                    <h4 className="text-[10px] font-black text-success-green mb-3 uppercase tracking-widest">Prevention Tips</h4>
                    <p className="text-text-secondary text-sm leading-relaxed font-medium">{selectedKnowledge.prevention}</p>
                  </div>
                  <div className="p-4 bg-cyber-blue/5 border border-cyber-blue/10 rounded-2xl shadow-sm">
                    <h4 className="text-[10px] font-black text-cyber-blue mb-3 uppercase tracking-widest">Detection Tools</h4>
                    <p className="text-text-secondary text-sm leading-relaxed font-medium">{selectedKnowledge.tools}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedKnowledge(null)}
                  className="w-full py-4 mt-4 bg-foreground/5 border border-border rounded-2xl font-black uppercase tracking-widest text-[11px] text-text-secondary hover:bg-foreground/10 hover:text-foreground transition-all shadow-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
