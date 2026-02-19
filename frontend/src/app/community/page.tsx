'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiMoreHorizontal,
  FiImage,
  FiSend,
  FiBookmark,
  FiUsers,
  FiTrendingUp,
  FiBook
} from 'react-icons/fi'
// import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/useApi'
import toast from 'react-hot-toast'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Post Card Component
function PostCard({ post, onLike, onComment }: { 
  post: any
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void 
}) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0)
  
  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    onLike(post.id)
  }
  
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    
    onComment(post.id, commentText)
    setCommentText('')
  }
  
  const formatDate = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diff = now.getTime() - postDate.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return postDate.toLocaleDateString('fr-FR')
  }
  
  return (
    <motion.div
      variants={fadeInUp}
      className="card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href={`/profile/${post.author?.username}`} className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
            {post.author?.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.firstName}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-semibold">
                {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 hover:text-primary">
              {post.author?.firstName} {post.author?.lastName}
            </h4>
            <p className="text-sm text-gray-500">@{post.author?.username} · {formatDate(post.createdAt)}</p>
          </div>
        </Link>
        
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>
      
      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`mb-4 rounded-xl overflow-hidden grid gap-2 ${
          post.images.length === 1 ? 'grid-cols-1' : 
          post.images.length === 2 ? 'grid-cols-2' : 
          post.images.length === 3 ? 'grid-cols-2' : 
          'grid-cols-2'
        }`}>
          {post.images.slice(0, 4).map((image: string, index: number) => (
            <div 
              key={index}
              className={`relative ${
                post.images.length === 3 && index === 0 ? 'row-span-2' : ''
              } aspect-video bg-gray-100`}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              {post.images.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+{post.images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Book Reference */}
      {post.book && (
        <Link 
          href={`/books/${post.book.id}`}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors"
        >
          <div className="w-12 h-16 relative rounded overflow-hidden bg-gray-200">
            {post.book.coverImage ? (
              <Image
                src={post.book.coverImage}
                alt={post.book.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiBook className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h5 className="font-medium text-gray-900">{post.book.title}</h5>
            <p className="text-sm text-gray-500">{post.book.author}</p>
          </div>
        </Link>
      )}
      
      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-500 pb-4 border-b">
        <span>{likesCount} j'aime</span>
        <span>{post._count?.comments || 0} commentaires</span>
        <span>{post._count?.shares || 0} partages</span>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
          <span>J'aime</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiMessageCircle className="w-5 h-5" />
          <span>Commenter</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <FiShare2 className="w-5 h-5" />
          <span>Partager</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <FiBookmark className="w-5 h-5" />
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
              U
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrire un commentaire..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary disabled:opacity-50"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* Comments List */}
          <div className="space-y-4">
            {post.comments?.map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {comment.author?.firstName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <Link href={`/profile/${comment.author?.username}`} className="font-semibold text-sm hover:text-primary">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </Link>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <button className="hover:text-primary">J'aime</button>
                    <button className="hover:text-primary">Répondre</button>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Create Post Component
function CreatePost({ onPost }: { onPost: (content: string, images?: string[]) => void }) {
  const user = null;
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    onPost(content)
    setContent('')
    setIsExpanded(false)
  }
  
  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Partagez vos pensées littéraires..."
              rows={isExpanded ? 4 : 1}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
            
            {isExpanded && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                  >
                    <FiImage className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                  >
                    <FiBook className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="btn-primary px-6 py-2 disabled:opacity-50"
                >
                  Publier
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

// Sidebar Suggestions
function SuggestedUsers() {
  const suggestions = [
    { id: '1', name: 'Aminata Diallo', username: 'aminata_lit', followers: 1234 },
    { id: '2', name: 'Kofi Asante', username: 'kofi_books', followers: 856 },
    { id: '3', name: 'Fatou Ndiaye', username: 'fatou_reads', followers: 2341 },
  ]
  
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiUsers className="text-primary" />
        Suggestions
      </h3>
      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user.name[0]}
              </div>
              <div>
                <p className="font-medium text-sm hover:text-primary">{user.name}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </Link>
            <button className="text-sm text-primary hover:underline">Suivre</button>
          </div>
        ))}
      </div>
      <Link href="/discover" className="block mt-4 text-center text-sm text-primary hover:underline">
        Voir plus
      </Link>
    </div>
  )
}

// Trending Topics
function TrendingTopics() {
  const topics = [
    { tag: 'LittératureAfricaine', posts: 1234 },
    { tag: 'NouveautésLivres', posts: 856 },
    { tag: 'ClubDeLecture', posts: 543 },
    { tag: 'Audiobooks', posts: 321 },
  ]
  
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-primary" />
        Tendances
      </h3>
      <div className="space-y-3">
        {topics.map((topic) => (
          <Link 
            key={topic.tag} 
            href={`/community?tag=${topic.tag}`}
            className="block hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
          >
            <p className="font-medium text-primary">#{topic.tag}</p>
            <p className="text-xs text-gray-500">{topic.posts} publications</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const user = null; const isAuthenticated = false;
  const { getPosts, createPost, likePost, commentPost, isLoading } = usePosts()
  const [posts, setPosts] = useState<any[]>([])
  const [filter, setFilter] = useState<'recent' | 'popular' | 'following'>('recent')
  
  useEffect(() => {
    fetchPosts()
  }, [filter])
  
  const fetchPosts = async () => {
    const { data } = await getPosts({ limit: 20 })
    if (data?.posts) {
      setPosts(data.posts)
    }
  }
  
  const handleCreatePost = async (content: string, images?: string[]) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour publier')
      return
    }
    
    const { data, error } = await createPost({ content, images })
    if (data) {
      setPosts([data.post, ...posts])
    }
  }
  
  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour aimer')
      return
    }
    await likePost(postId)
  }
  
  const handleComment = async (postId: string, content: string) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour commenter')
      return
    }
    
    const { data } = await commentPost(postId, content)
    if (data) {
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, comments: [...(p.comments || []), data.comment] }
          : p
      ))
    }
  }
  
  // Demo posts
  const demoPosts = [
    {
      id: '1',
      content: 'Je viens de terminer "Les Soleils des Indépendances" d\'Ahmadou Kourouma. Un chef-d\'œuvre absolu! La façon dont il mélange le français et le malinké est fascinante. 📚✨\n\nQui d\'autre a lu ce livre? J\'aimerais en discuter!',
      author: { firstName: 'Aminata', lastName: 'Diallo', username: 'aminata_lit' },
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      _count: { likes: 124, comments: 23, shares: 12 },
      isLiked: false,
      comments: []
    },
    {
      id: '2',
      content: 'Nouvelle arrivée dans ma bibliothèque! 🎉\n\nJe suis tellement excité de commencer "Une Si Longue Lettre" de Mariama Bâ. On m\'en a dit tellement de bien!',
      author: { firstName: 'Kofi', lastName: 'Mensah', username: 'kofi_books' },
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      _count: { likes: 89, comments: 15, shares: 8 },
      isLiked: true,
      comments: []
    },
    {
      id: '3',
      content: 'Conseil lecture du jour:\n\nSi vous aimez la littérature africaine contemporaine, je vous recommande vivement "L\'Aventure Ambiguë" de Cheikh Hamidou Kane. Un roman philosophique qui explore le choc des cultures.\n\n#LittératureAfricaine #ConseilLecture',
      author: { firstName: 'Fatou', lastName: 'Ndiaye', username: 'fatou_reads' },
      createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      _count: { likes: 256, comments: 42, shares: 31 },
      isLiked: false,
      comments: []
    },
  ]
  const displayPosts = posts.length > 0 ? posts : demoPosts
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Communauté
          </h1>
          <p className="text-gray-600">
            Partagez vos lectures et discutez avec d'autres passionnés
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl">
            {/* Create Post */}
            {isAuthenticated && <CreatePost onPost={handleCreatePost} />}
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-4 mb-6 bg-white rounded-xl p-2">
              {[
                { key: 'recent', label: 'Récent' },
                { key: 'popular', label: 'Populaire' },
                { key: 'following', label: 'Abonnements' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === tab.key 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Posts */}
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-6"
              >
                {displayPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))}
              </motion.div>
            )}
            
            {/* Login CTA */}
            {!isAuthenticated && (
              <div className="card text-center mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Rejoignez la conversation!
                </h3>
                <p className="text-gray-600 mb-4">
                  Créez un compte pour partager vos lectures et interagir avec la communauté.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/register" className="btn-primary">
                    Créer un compte
                  </Link>
                  <Link href="/login" className="btn-secondary">
                    Se connecter
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 space-y-6">
            <SuggestedUsers />
            <TrendingTopics />
          </aside>
        </div>
      </div>
    </main>
  )
}
