'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Menu,
  X,
  Coins,
  Zap,
  Lock,
  Gift,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ─── Data ───────────────────────────────────────────────────────────

const CONTRACT_ADDRESS = '0x1b0fb286fd0f0b48e9af0a5b7bdd2fabda60a55a'
const DEXSCREENER_URL = 'https://dexscreener.com/base/0x1b0fb286fd0f0b48e9af0a5b7bdd2fabda60a55a'
const DEXTOOLS_URL = 'https://www.dextools.io/app/base/pair-explorer/0x1b0fb286fd0f0b48e9af0a5b7bdd2fabda60a55a'
const UNISWAP_URL = 'https://app.uniswap.org'
const X_URL = 'https://x.com/rogan_coin'
const TELEGRAM_URL = 'https://t.me/+4TVCiHL8PEE0YTk1'

const usdToRogan = [
  { usd: 1, rogan: '760,079.087' },
  { usd: 5, rogan: '3,800,395.435' },
  { usd: 10, rogan: '7,600,790.871' },
  { usd: 25, rogan: '19,001,977.179' },
  { usd: 50, rogan: '38,003,954.358' },
  { usd: 100, rogan: '76,007,908.717' },
  { usd: 500, rogan: '380,039,543.589' },
  { usd: 1000, rogan: '760,079,087.178' },
  { usd: 10000, rogan: '7,600,790,871.787' },
  { usd: 50000, rogan: '38,003,954,358.935' },
]

const roganToUsd = [
  { rogan: 1, usd: '0.00000131' },
  { rogan: 5, usd: '0.00000657' },
  { rogan: 10, usd: '0.0000131' },
  { rogan: 25, usd: '0.0000328' },
  { rogan: 50, usd: '0.0000657' },
  { rogan: 100, usd: '0.000131' },
  { rogan: 500, usd: '0.000657' },
  { rogan: 1000, usd: '0.00131' },
  { rogan: 10000, usd: '0.0131' },
  { rogan: 50000, usd: '0.0657' },
]

const faqs = [
  {
    q: 'What is Rogan?',
    a: 'Rogan is a memecoin built on the Base blockchain. It\'s designed to be fun, community-driven, and serves as a gifting mechanism for creators on streaming platforms. Despite the name, Rogan has no affiliation with Joe Rogan or any podcast — it\'s its own thing entirely.',
  },
  {
    q: 'What blockchain is Rogan on?',
    a: 'Rogan is deployed on Base, an Ethereum Layer 2 blockchain. This means you get the security of Ethereum with faster transactions and significantly lower gas fees. Base is one of the most popular L2 networks, making it an ideal home for Rogan.',
  },
  {
    q: 'How can I buy Rogan?',
    a: 'You can buy ROGAN on Uniswap V2 through the Base network. Simply connect your wallet (like MetaMask or Coinbase Wallet), ensure you have ETH on Base for gas, and swap for ROGAN using the contract address. Always verify the contract address before trading.',
  },
  {
    q: 'What is the total supply of Rogan?',
    a: 'The total supply is 1 billion ROGAN tokens. There is no minting function — the supply is fixed, meaning no additional tokens will ever be created. This ensures scarcity and protects holders from dilution.',
  },
  {
    q: 'What\'s the connection between Rogan and streaming?',
    a: 'We\'re building a Streaming Record Label, and Rogan is intended to be one of the primary means for fans to gift and support their favorite creators on streaming platforms. It brings real utility to memecoin culture, combining the fun of memes with the purpose of empowering creators.',
  },
  {
    q: 'Is Rogan affiliated with Joe Rogan?',
    a: 'No, absolutely not. Rogan is an independent project with no connection to Joe Rogan, his podcast, or any associated entities. The name is coincidental and the project stands entirely on its own merits as a unique memecoin with its own vision and community.',
  },
  {
    q: 'Where can I track the Rogan price?',
    a: 'You can track ROGAN\'s live price and trading data on DexScreener and DexTools. Links to both platforms are available on this page. These DEX aggregators provide real-time charts, transaction history, and liquidity information.',
  },
  {
    q: 'Is there a liquidity pool?',
    a: 'Yes, Rogan has a liquidity pool on Uniswap V2 on the Base network. This allows for decentralized trading without the need for a centralized exchange. The liquidity pool ensures that users can always swap between ROGAN and other tokens.',
  },
]

const tokenDetails = [
  { label: 'Token Name', value: 'Rogan', icon: Coins },
  { label: 'Ticker', value: 'ROGAN', icon: Zap },
  { label: 'Blockchain', value: 'Base (Ethereum L2)', icon: Lock },
  { label: 'Total Supply', value: '1,000,000,000', icon: BarChart3 },
  { label: 'Circulating Supply', value: '1,000,000,000', icon: BarChart3 },
  { label: 'DEX', value: 'Uniswap V2', icon: Gift },
  { label: 'Market Cap', value: '~$1.29K', icon: Coins },
  { label: '24h Volume', value: '~$140.82', icon: BarChart3 },
  { label: '24h Change', value: '+0.00000062%', icon: Zap },
]

// ─── Animation helpers ───────────────────────────────────────────────

function FadeInSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Copy Button ─────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-neon transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-neon" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// ─── Telegram Icon ────────────────────────────────────────────────────

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

// ─── X Icon ──────────────────────────────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Chart', href: '#chart' },
    { label: 'Converter', href: '#converter' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-card bg-black/70 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src="/rogan-logo.png"
              alt="Rogan Logo"
              className="w-9 h-9 rounded-lg group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-shadow"
            />
            <span className="text-xl font-bold gradient-text">ROGAN</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-neon transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={UNISWAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon text-black font-semibold text-sm hover:bg-neon-dim transition-colors glow-green-sm"
            >
              Buy on Uniswap
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-neon transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card bg-black/90 border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-zinc-400 hover:text-neon transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={UNISWAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 mt-2 text-center rounded-lg bg-neon text-black font-semibold text-sm hover:bg-neon-dim transition-colors"
              >
                Buy on Uniswap
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 text-neon border-neon/30 bg-neon/5 text-sm"
          >
            🔥 Live on Base Mainnet
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6"
        >
          <span className="gradient-text">ROGAN</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-4 font-medium"
        >
          The Base Chain Memecoin Powering Creator Gifting
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto mb-10"
        >
          Rogan isn&apos;t just another memecoin — it&apos;s the future of tipping creators on streaming platforms. Built on Base. Driven by community.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { label: 'Price', value: '$0.00000132' },
            { label: 'Market Cap', value: '$1.29K' },
            { label: '24h Volume', value: '$140.82' },
            { label: 'Supply', value: '1B ROGAN' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl px-4 py-3 min-w-[140px]"
            >
              <div className="text-xs text-zinc-500 mb-0.5">{stat.label}</div>
              <div className="text-sm font-semibold text-zinc-200">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#chart"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass-card border border-white/10 text-zinc-200 font-semibold hover:border-neon/30 hover:text-neon transition-all group"
          >
            View Chart
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={UNISWAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-neon text-black font-bold hover:bg-neon-dim transition-colors glow-green animate-pulse-glow"
          >
            Buy ROGAN Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16"
        >
          <a href="#about" className="inline-flex flex-col items-center text-zinc-600 hover:text-zinc-400 transition-colors">
            <span className="text-xs mb-2">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── About Section ───────────────────────────────────────────────────

function AboutSection() {
  const features = [
    {
      icon: Gift,
      title: 'Creator Tipping',
      desc: 'Designed as a gifting mechanism for streaming creators. Support your favorite streamers with ROGAN and be part of the creator economy revolution.',
    },
    {
      icon: Zap,
      title: 'Base Chain',
      desc: 'Built on Base for lightning-fast transactions, minimal gas fees, and the robust security of Ethereum. The future of DeFi starts with Layer 2.',
    },
    {
      icon: Lock,
      title: 'Fixed Supply',
      desc: '1 Billion tokens max. No more, no less. No minting function means zero dilution — what you hold is a fixed piece of the Rogan ecosystem forever.',
    },
  ]

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-cyan border-cyan/30 bg-cyan/5 text-sm">
              Our Story
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              The Story of <span className="gradient-text">Rogan</span>
            </h2>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Born on the lightning-fast Base blockchain, Rogan emerged from the vibrant intersection of meme culture and the creator economy. While the name might ring familiar, Rogan has <strong className="text-zinc-200">nothing to do with any podcast host</strong> — it stands on its own as a symbol of the new creator revolution.
            </p>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              At its core, Rogan is a memecoin with a mission. We&apos;re building a <strong className="text-zinc-200">Streaming Record Label</strong>, and Rogan will serve as one of the primary means of gifting and supporting creators on streaming platforms. Imagine tipping your favorite streamer not with fiat, but with a token that&apos;s part of a movement.
            </p>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              With a fixed supply of 1 billion tokens and a liquidity pool on Uniswap V2, Rogan is designed to be accessible, community-driven, and fun. It&apos;s <strong className="text-zinc-200">memecoin energy meets real utility</strong> — and it&apos;s just getting started.
            </p>
          </div>
        </FadeInSection>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FadeInSection key={feature.title} delay={0.2 + i * 0.1}>
              <div className="glass-card rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 group hover:shadow-[0_0_30px_rgba(0,255,136,0.08)]">
                <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-5 group-hover:bg-neon/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-neon" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-200 mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Chart Section ───────────────────────────────────────────────────

function ChartSection() {
  return (
    <section id="chart" className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-neon border-neon/30 bg-neon/5 text-sm">
              Live Data
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Live <span className="gradient-text">Chart</span>
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
              Real-time price chart powered by DexScreener. Track ROGAN&apos;s performance on the Base network.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="glass-card rounded-2xl overflow-hidden">
            <iframe
              src={`${DEXSCREENER_URL}?embed=1&theme=dark&info=0`}
              className="w-full"
              style={{ height: '600px', border: 'none' }}
              title="ROGAN Price Chart"
              allow="clipboard-write"
            />
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href={DEXSCREENER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium text-zinc-300 hover:text-neon hover:border-neon/30 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              View on DexScreener
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={DEXTOOLS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium text-zinc-300 hover:text-cyan hover:border-cyan/30 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              View on DexTools
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Converter Section ───────────────────────────────────────────────

function ConverterSection() {
  return (
    <section id="converter" className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-neon border-neon/30 bg-neon/5 text-sm">
              💱 Converter
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Price <span className="gradient-text">Converter</span>
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto">
              Quick reference for converting between USD and ROGAN at current market rates.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <Tabs defaultValue="usd-to-rogan" className="max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 h-12">
              <TabsTrigger
                value="usd-to-rogan"
                className="data-[state=active]:bg-neon/15 data-[state=active]:text-neon text-zinc-400 text-sm font-medium"
              >
                USD → ROGAN
              </TabsTrigger>
              <TabsTrigger
                value="rogan-to-usd"
                className="data-[state=active]:bg-cyan/15 data-[state=active]:text-cyan text-zinc-400 text-sm font-medium"
              >
                ROGAN → USD
              </TabsTrigger>
            </TabsList>

            <TabsContent value="usd-to-rogan" className="mt-6">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-neon">USD</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-neon">ROGAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usdToRogan.map((row, i) => (
                        <tr
                          key={row.usd}
                          className={`border-b border-white/5 table-row-hover transition-colors ${
                            i % 2 === 0 ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-zinc-300">
                            ${row.usd.toLocaleString()}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-right font-mono text-zinc-400">
                            {row.rogan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rogan-to-usd" className="mt-6">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-cyan">ROGAN</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-cyan">USD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roganToUsd.map((row, i) => (
                        <tr
                          key={row.rogan}
                          className={`border-b border-white/5 table-row-hover transition-colors ${
                            i % 2 === 0 ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          <td className="px-6 py-3.5 text-sm font-medium text-zinc-300">
                            {row.rogan.toLocaleString()}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-right font-mono text-zinc-400">
                            ${row.usd}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <p className="text-center text-xs text-zinc-600 mt-6 max-w-lg mx-auto">
            Prices are approximate and based on current market rates. Always verify on DEX before trading.
          </p>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Token Info Section ──────────────────────────────────────────────

function TokenInfoSection() {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-cyan border-cyan/30 bg-cyan/5 text-sm">
              Details
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Token <span className="gradient-text">Details</span>
            </h2>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokenDetails.map((detail, i) => (
            <FadeInSection key={detail.label} delay={0.05 * i}>
              <div className="glass-card rounded-xl p-5 flex items-center gap-4 group hover:shadow-[0_0_20px_rgba(0,255,136,0.06)] transition-all">
                <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center shrink-0 group-hover:bg-neon/20 transition-colors">
                  <detail.icon className="w-5 h-5 text-neon" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-500 mb-0.5">{detail.label}</div>
                  <div className="text-sm font-semibold text-zinc-200 truncate">{detail.value}</div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* Contract Address */}
        <FadeInSection delay={0.3}>
          <div className="glass-card rounded-xl p-5 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-neon" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-500 mb-0.5">Contract Address</div>
                  <div className="text-sm font-mono text-zinc-300 truncate">{CONTRACT_ADDRESS}</div>
                </div>
              </div>
              <CopyButton text={CONTRACT_ADDRESS} />
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── FAQ Section ─────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-neon border-neon/30 bg-neon/5 text-sm">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card rounded-xl border-0 px-6 data-[state=open]:shadow-[0_0_20px_rgba(0,255,136,0.06)] transition-all"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-zinc-200 hover:text-neon py-5 hover:no-underline [&[data-state=open]>svg]:text-neon">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-400 leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeInSection>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  const socialLinks = [
    { label: 'X (Twitter)', href: X_URL, icon: XIcon },
    { label: 'Telegram', href: TELEGRAM_URL, icon: TelegramIcon },
    { label: 'DexScreener', href: DEXSCREENER_URL, icon: BarChart3 },
    { label: 'DexTools', href: DEXTOOLS_URL, icon: BarChart3 },
    { label: 'Uniswap', href: UNISWAP_URL, icon: Coins },
  ]

  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <a href="#" className="flex items-center gap-2.5">
              <img src="/rogan-logo.png" alt="Rogan Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-lg font-bold gradient-text">ROGAN</span>
            </a>
            <p className="text-xs text-zinc-600 text-center md:text-left max-w-xs">
              The Base Chain Memecoin Powering Creator Gifting
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-zinc-500 hover:text-neon hover:border-neon/30 transition-all"
                title={link.label}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Rogan Token. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Not financial advice. DYOR. Crypto is volatile.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ChartSection />
        <ConverterSection />
        <TokenInfoSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
