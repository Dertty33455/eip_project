import Link from 'next/link'
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker
} from 'react-icons/hi'
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa'
import { FiArrowRight, FiSend } from 'react-icons/fi'

const footerLinks = {
  platform: [
    { name: 'À propos', href: '/about' },
    { name: 'Comment ça marche', href: '/how-it-works' },
    { name: 'Nos auteurs', href: '/authors' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carrières', href: '/careers' },
  ],
  support: [
    { name: 'Centre d\'aide', href: '/help' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Nous contacter', href: '/contact' },
    { name: 'Signaler un problème', href: '/report' },
  ],
  legal: [
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'Politique de cookies', href: '/cookies' },
    { name: 'Mentions légales', href: '/legal' },
  ],
  sellers: [
    { name: 'Devenir vendeur', href: '/become-seller' },
    { name: 'Guide du vendeur', href: '/seller-guide' },
    { name: 'Tarifs & commissions', href: '/pricing' },
    { name: 'Ressources vendeur', href: '/seller-resources' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: FaFacebookF, href: '#', color: 'hover:bg-blue-600' },
  { name: 'Twitter', icon: FaTwitter, href: '#', color: 'hover:bg-sky-500' },
  { name: 'Instagram', icon: FaInstagram, href: '#', color: 'hover:bg-pink-600' },
  { name: 'LinkedIn', icon: FaLinkedinIn, href: '#', color: 'hover:bg-blue-700' },
  { name: 'WhatsApp', icon: FaWhatsapp, href: '#', color: 'hover:bg-green-600' },
]

export function Footer() {
  return (
    <footer className="bg-earth-900 text-cream-100 relative overflow-hidden">
      {/* Gradient separator */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-400" />

      {/* Newsletter Section */}
      <div className="border-b border-earth-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                Restez connecté 📚
              </h3>
              <p className="text-cream-300 max-w-md">
                Recevez les dernières nouveautés, recommandations et offres exclusives.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-5 py-3.5 bg-earth-800 border border-earth-700 rounded-xl text-white placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-300 hover:shadow-african flex items-center gap-2 flex-shrink-0 group"
              >
                <span className="hidden sm:inline">S&apos;abonner</span>
                <FiSend className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Book<span className="text-primary-400">Shell</span>
              </span>
            </Link>
            <p className="text-cream-400 mb-6 max-w-sm leading-relaxed">
              La première plateforme africaine de livres et livres audio.
              Découvrez, partagez et célébrez la littérature africaine.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contact@BookShell.com"
                className="flex items-center space-x-2.5 text-cream-400 hover:text-primary-400 transition-colors group"
              >
                <HiOutlineMail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">contact@BookShell.com</span>
              </a>
              <a
                href="tel:+22500000000"
                className="flex items-center space-x-2.5 text-cream-400 hover:text-primary-400 transition-colors group"
              >
                <HiOutlinePhone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+225 00 00 00 00</span>
              </a>
              <div className="flex items-center space-x-2.5 text-cream-400">
                <HiOutlineLocationMarker className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Abidjan, Côte d&apos;Ivoire</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Plateforme</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Vendeurs</h3>
            <ul className="space-y-3">
              {footerLinks.sellers.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-primary-400 transition-colors text-sm hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods & Social */}
        <div className="mt-14 pt-10 border-t border-earth-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Moyens de paiement</h4>
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2.5 bg-yellow-500/15 border border-yellow-500/30 rounded-xl text-yellow-400 font-semibold text-sm hover:bg-yellow-500/25 transition-colors cursor-default">
                  MTN MoMo
                </div>
                <div className="px-4 py-2.5 bg-blue-500/15 border border-blue-500/30 rounded-xl text-blue-400 font-semibold text-sm hover:bg-blue-500/25 transition-colors cursor-default">
                  Moov Money
                </div>
                <div className="px-4 py-2.5 bg-primary-500/15 border border-primary-500/30 rounded-xl text-primary-400 font-semibold text-sm hover:bg-primary-500/25 transition-colors cursor-default">
                  Wallet
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Suivez-nous</h4>
              <div className="flex items-center space-x-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 rounded-xl bg-earth-800 flex items-center justify-center text-cream-400 ${social.color} hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-earth-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-earth-500 text-sm">
              © {new Date().getFullYear()} BookShell. Tous droits réservés.
            </p>
            <p className="text-earth-500 text-sm">
              Fait avec ❤️ en Afrique pour l&apos;Afrique 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
