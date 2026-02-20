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
  { name: 'Facebook', icon: FaFacebookF, href: '#' },
  { name: 'Twitter', icon: FaTwitter, href: '#' },
  { name: 'Instagram', icon: FaInstagram, href: '#' },
  { name: 'LinkedIn', icon: FaLinkedinIn, href: '#' },
  { name: 'WhatsApp', icon: FaWhatsapp, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-earth-800 text-cream-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Afri<span className="text-primary-400">Book</span>
              </span>
            </Link>
            <p className="text-cream-300 mb-6 max-w-sm">
              La première plateforme africaine de livres et livres audio. 
              Découvrez, partagez et célébrez la littérature africaine.
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:contact@BookShell.com"
                className="flex items-center space-x-2 text-cream-300 hover:text-primary-400 transition-colors"
              >
                <HiOutlineMail className="w-5 h-5" />
                <span>contact@BookShell.com</span>
              </a>
              <a 
                href="tel:+22500000000"
                className="flex items-center space-x-2 text-cream-300 hover:text-primary-400 transition-colors"
              >
                <HiOutlinePhone className="w-5 h-5" />
                <span>+225 00 00 00 00</span>
              </a>
              <div className="flex items-center space-x-2 text-cream-300">
                <HiOutlineLocationMarker className="w-5 h-5 flex-shrink-0" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plateforme</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-cream-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-cream-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Vendeurs</h3>
            <ul className="space-y-3">
              {footerLinks.sellers.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-cream-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-cream-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-earth-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Moyens de paiement acceptés</h4>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-yellow-500 rounded-lg text-earth-800 font-semibold text-sm">
                  MTN MoMo
                </div>
                <div className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold text-sm">
                  Moov Money
                </div>
                <div className="px-4 py-2 bg-primary-500 rounded-lg text-white font-semibold text-sm">
                  Wallet
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Suivez-nous</h4>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-earth-700 flex items-center justify-center text-cream-300 hover:bg-primary-500 hover:text-white transition-colors"
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
      <div className="bg-earth-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-cream-400 text-sm">
              © {new Date().getFullYear()} BookShell. Tous droits réservés.
            </p>
            <p className="text-cream-400 text-sm">
              Fait avec ❤️ en Afrique pour l'Afrique 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
