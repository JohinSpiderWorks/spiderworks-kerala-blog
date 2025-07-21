// "use client"
// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, Share2, MapPin, Calendar, Briefcase, Mail, Phone, Globe, Camera, Edit3, Settings, MoreHorizontal, Star, Zap, Award, Bookmark, Send, Video, Music, Coffee, Sparkles, TrendingUp, Eye } from 'lucide-react';

// export default function ModernProfilePage() {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [activeTab, setActiveTab] = useState('posts');
//   const [isEditing, setIsEditing] = useState(false);
//   const [likedPosts, setLikedPosts] = useState(new Set());
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isOnline, setIsOnline] = useState(true);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const stats = [
//     { label: 'Posts', value: '1,234', icon: Camera, color: 'from-purple-500 to-pink-500' },
//     { label: 'Followers', value: '12.5K', icon: Heart, color: 'from-blue-500 to-cyan-500' },
//     { label: 'Following', value: '892', icon: Star, color: 'from-green-500 to-emerald-500' }
//   ];

//   const posts = [
//     { id: 1, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', likes: 234, comments: 12, views: 1200, type: 'photo' },
//     { id: 2, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', likes: 189, comments: 8, views: 980, type: 'video' },
//     { id: 3, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop', likes: 156, comments: 15, views: 750, type: 'photo' },
//     { id: 4, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop', likes: 298, comments: 23, views: 1500, type: 'photo' },
//     { id: 5, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', likes: 167, comments: 9, views: 890, type: 'photo' },
//     { id: 6, image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop', likes: 203, comments: 11, views: 1100, type: 'video' }
//   ];

//   const achievements = [
//     { name: 'Top Creator', icon: Award, color: 'text-yellow-500' },
//     { name: 'Verified', icon: Star, color: 'text-blue-500' },
//     { name: 'Trendsetter', icon: TrendingUp, color: 'text-purple-500' },
//     { name: 'Coffee Lover', icon: Coffee, color: 'text-amber-500' }
//   ];

//   const toggleLike = (postId) => {
//     setLikedPosts(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(postId)) {
//         newSet.delete(postId);
//       } else {
//         newSet.add(postId);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-white p-4 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
//         <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
//         <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-3000"></div>
//       </div>

//       {/* Mouse Follower Effect */}
//       <div 
//         className="fixed w-4 h-4 bg-amber-500 rounded-full opacity-50 pointer-events-none z-50 transition-all duration-100"
//         style={{
//           left: mousePos.x - 8,
//           top: mousePos.y - 8,
//           transform: 'scale(0.8)',
//         }}
//       />

//       <div className="max-w-5xl mx-auto relative z-10">
//         {/* Header Card with Glassmorphism */}
//         <div className="bg-gray-50/80 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl border border-gray-200/50 relative overflow-hidden">
//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-amber-500/10 rounded-3xl"></div>
          
//           <div className="relative z-10">
//             <div className="flex justify-between items-start mb-8">
//               <div className="flex items-center space-x-6">
//                 <div className="relative group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
//                   <img 
//                     src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
//                     alt="Profile"
//                     className="relative w-32 h-32 rounded-full border-4 border-white/60 shadow-2xl transform group-hover:scale-105 transition-all duration-300"
//                   />
//                   <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-4 border-white animate-pulse`}></div>
//                   <button className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group">
//                     <Camera className="w-5 h-5 text-white" />
//                   </button>
//                 </div>
//                 <div className="text-gray-800">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Alex Johnson</h1>
//                     <div className="flex space-x-1">
//                       {achievements.slice(0, 2).map((achievement, index) => (
//                         <div key={index} className={`${achievement.color} animate-bounce`} style={{ animationDelay: `${index * 0.2}s` }}>
//                           <achievement.icon className="w-6 h-6" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <p className="text-gray-600 text-xl mb-3">@alexjohnson</p>
//                   <div className="flex items-center text-gray-500 space-x-4">
//                     <div className="flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       <span className="text-sm">San Francisco, CA</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Sparkles className="w-4 h-4 mr-1" />
//                       <span className="text-sm">Creator Level 5</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex space-x-3">
//                 <button className="bg-gray-100/80 backdrop-blur-lg rounded-full p-4 hover:bg-gray-200/80 transition-all duration-300 border border-gray-200/50 group">
//                   <Settings className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
//                 </button>
//                 <button className="bg-gray-100/80 backdrop-blur-lg rounded-full p-4 hover:bg-gray-200/80 transition-all duration-300 border border-gray-200/50">
//                   <MoreHorizontal className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//             </div>

//             {/* Enhanced Bio Section */}
//             <div className="mb-8 bg-gray-50/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/30">
//               <p className="text-gray-700 text-lg leading-relaxed mb-4">
//                 ✨ Digital creator & photographer capturing life's beautiful moments
//                 <br />
//                 🌍 Travel enthusiast sharing adventures around the globe
//                 <br />
//                 📸 Available for collaborations & creative projects
//                 <br />
//                 🎵 Music lover & coffee enthusiast
//               </p>
              
//               <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
//                 <div className="flex items-center bg-amber-50 rounded-full px-3 py-1 border border-amber-200">
//                   <Briefcase className="w-4 h-4 mr-2" />
//                   <span>Creative Director</span>
//                 </div>
//                 <div className="flex items-center bg-pink-50 rounded-full px-3 py-1 border border-pink-200">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   <span>Joined March 2020</span>
//                 </div>
//                 <div className="flex items-center bg-amber-50 rounded-full px-3 py-1 border border-amber-200">
//                   <Globe className="w-4 h-4 mr-2" />
//                   <span>alexjohnson.com</span>
//                 </div>
//               </div>

//               {/* Achievement Badges */}
//               <div className="flex flex-wrap gap-2">
//                 {achievements.map((achievement, index) => (
//                   <div key={index} className="flex items-center bg-white/60 rounded-full px-3 py-1 hover:bg-white/80 transition-all duration-300 group cursor-pointer border border-gray-200/50">
//                     <achievement.icon className={`w-4 h-4 mr-1 ${achievement.color} group-hover:animate-pulse`} />
//                     <span className="text-xs text-gray-600">{achievement.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Enhanced Stats */}
//             <div className="grid grid-cols-3 gap-6 mb-8">
//               {stats.map((stat, index) => (
//                 <div key={index} className="text-center group cursor-pointer">
//                   <div className={`w-16 h-16 mx-auto mb-2 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
//                     <stat.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
//                   <div className="text-gray-600 text-sm">{stat.label}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Enhanced Action Buttons */}
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setIsFollowing(!isFollowing)}
//                 className={`flex-1 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//                   isFollowing
//                     ? 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
//                     : 'bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:from-amber-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
//                 }`}
//               >
//                 {isFollowing ? 'Following' : 'Follow'}
//               </button>
//               <button className="flex-1 py-4 px-8 rounded-2xl font-semibold bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
//                 <Send className="w-5 h-5 mr-2" />
//                 Message
//               </button>
//               <button className="py-4 px-8 rounded-2xl bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
//                 <Share2 className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Content Tabs */}
//         <div className="bg-gray-50/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
//           <div className="flex border-b border-gray-200/50 bg-white/40">
//             {[
//               { id: 'posts', label: 'Posts', icon: Camera },
//               { id: 'about', label: 'About', icon: Star },
//               { id: 'photos', label: 'Photos', icon: Eye },
//               { id: 'videos', label: 'Videos', icon: Video }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 py-6 px-6 font-semibold capitalize transition-all duration-300 flex items-center justify-center space-x-2 ${
//                   activeTab === tab.id
//                     ? 'text-gray-800 bg-gradient-to-r from-amber-50 to-pink-50 border-b-2 border-amber-400 shadow-lg'
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//               >
//                 <tab.icon className="w-5 h-5" />
//                 <span>{tab.label}</span>
//               </button>
//             ))}
//           </div>

//           <div className="p-8">
//             {activeTab === 'posts' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {posts.map((post) => (
//                   <div key={post.id} className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-lg border border-gray-200/50 hover:border-amber-300/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
//                     <div className="relative">
//                       <img 
//                         src={post.image} 
//                         alt={`Post ${post.id}`}
//                         className="w-full h-56 object-cover"
//                       />
//                       {post.type === 'video' && (
//                         <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-2">
//                           <Video className="w-4 h-4 text-white" />
//                         </div>
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
//                         <div className="absolute bottom-4 left-4 right-4">
//                           <div className="flex justify-between items-center text-white mb-3">
//                             <div className="flex items-center space-x-4">
//                               <button
//                                 onClick={() => toggleLike(post.id)}
//                                 className="flex items-center space-x-1 hover:scale-110 transition-transform"
//                               >
//                                 <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
//                                 <span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
//                               </button>
//                               <div className="flex items-center space-x-1">
//                                 <MessageCircle className="w-5 h-5" />
//                                 <span className="text-sm">{post.comments}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Eye className="w-5 h-5" />
//                                 <span className="text-sm">{post.views}</span>
//                               </div>
//                             </div>
//                             <button className="hover:scale-110 transition-transform">
//                               <Bookmark className="w-5 h-5" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeTab === 'about' && (
//               <div className="space-y-6">
//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full flex items-center justify-center">
//                       <Star className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-gray-800">About Me</h3>
//                   </div>
//                   <p className="text-gray-600 leading-relaxed text-lg">
//                     I'm a passionate digital creator and photographer based in San Francisco. With over 5 years of experience in visual storytelling, I love capturing the beauty in everyday moments and sharing them with the world. When I'm not behind the camera, you can find me exploring new places, trying different cuisines, or working on creative projects that inspire me.
//                   </p>
//                 </div>

//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
//                       <Mail className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-gray-800">Contact Information</h3>
//                   </div>
//                   <div className="space-y-4">
//                     {[
//                       { icon: Mail, text: 'alex.johnson@email.com', color: 'from-blue-500 to-cyan-500' },
//                       { icon: Phone, text: '+1 (555) 123-4567', color: 'from-green-500 to-emerald-500' },
//                       { icon: Globe, text: 'www.alexjohnson.com', color: 'from-amber-500 to-pink-500' }
//                     ].map((item, index) => (
//                       <div key={index} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group cursor-pointer">
//                         <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
//                           <item.icon className="w-5 h-5 text-white" />
//                         </div>
//                         <span className="text-lg">{item.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
//                       <Zap className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-gray-800">Skills & Interests</h3>
//                   </div>
//                   <div className="flex flex-wrap gap-3">
//                     {['Photography', 'Digital Art', 'Travel', 'Nature', 'Portrait', 'Landscape', 'Adobe Creative Suite', 'Drone Photography', 'Video Editing', 'Music Production'].map((skill, index) => (
//                       <span key={skill} className="bg-gradient-to-r from-amber-100 to-pink-100 text-gray-700 px-4 py-2 rounded-full text-sm border border-amber-200/50 hover:border-pink-200/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {(activeTab === 'photos' || activeTab === 'videos') && (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {posts.filter(post => activeTab === 'photos' ? post.type === 'photo' : post.type === 'video').concat(posts.filter(post => activeTab === 'photos' ? post.type === 'photo' : post.type === 'video')).map((post, index) => (
//                   <div key={index} className="aspect-square overflow-hidden rounded-2xl bg-white/60 backdrop-blur-lg border border-gray-200/50 hover:border-amber-300/50 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
//                     <div className="relative w-full h-full">
//                       <img 
//                         src={post.image} 
//                         alt={`${activeTab.slice(0, -1)} ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       {activeTab === 'videos' && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
//                           <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
//                             <Video className="w-6 h-6 text-white" />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {[
//               { id: 'posts', label: 'Posts', icon: Camera },
//               { id: 'about', label: 'About', icon: Star },
//               { id: 'photos', label: 'Photos', icon: Eye },
//               { id: 'videos', label: 'Videos', icon: Video }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 py-6 px-6 font-semibold capitalize transition-all duration-300 flex items-center justify-center space-x-2 ${
//                   activeTab === tab.id
//                     ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-b-2 border-white shadow-lg'
//                     : 'text-gray-300 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 <tab.icon className="w-5 h-5" />
//                 <span>{tab.label}</span>
//               </button>
//             ))}
//           </div>

//           <div className="p-8">
//             {activeTab === 'posts' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {posts.map((post) => (
//                   <div key={post.id} className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
//                     <div className="relative">
//                       <img 
//                         src={post.image} 
//                         alt={`Post ${post.id}`}
//                         className="w-full h-56 object-cover"
//                       />
//                       {post.type === 'video' && (
//                         <div className="absolute top-3 right-3 bg-red-500 rounded-full p-2">
//                           <Video className="w-4 h-4 text-white" />
//                         </div>
//                       )}
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
//                         <div className="absolute bottom-4 left-4 right-4">
//                           <div className="flex justify-between items-center text-white mb-3">
//                             <div className="flex items-center space-x-4">
//                               <button
//                                 onClick={() => toggleLike(post.id)}
//                                 className="flex items-center space-x-1 hover:scale-110 transition-transform"
//                               >
//                                 <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
//                                 <span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
//                               </button>
//                               <div className="flex items-center space-x-1">
//                                 <MessageCircle className="w-5 h-5" />
//                                 <span className="text-sm">{post.comments}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Eye className="w-5 h-5" />
//                                 <span className="text-sm">{post.views}</span>
//                               </div>
//                             </div>
//                             <button className="hover:scale-110 transition-transform">
//                               <Bookmark className="w-5 h-5" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeTab === 'about' && (
//               <div className="space-y-6">
//                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                       <Star className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-white">About Me</h3>
//                   </div>
//                   <p className="text-gray-300 leading-relaxed text-lg">
//                     I'm a passionate digital creator and photographer based in San Francisco. With over 5 years of experience in visual storytelling, I love capturing the beauty in everyday moments and sharing them with the world. When I'm not behind the camera, you can find me exploring new places, trying different cuisines, or working on creative projects that inspire me.
//                   </p>
//                 </div>

//                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
//                       <Mail className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-white">Contact Information</h3>
//                   </div>
//                   <div className="space-y-4">
//                     {[
//                       { icon: Mail, text: 'alex.johnson@email.com', color: 'from-blue-500 to-cyan-500' },
//                       { icon: Phone, text: '+1 (555) 123-4567', color: 'from-green-500 to-emerald-500' },
//                       { icon: Globe, text: 'www.alexjohnson.com', color: 'from-purple-500 to-pink-500' }
//                     ].map((item, index) => (
//                       <div key={index} className="flex items-center text-gray-300 hover:text-white transition-colors group cursor-pointer">
//                         <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
//                           <item.icon className="w-5 h-5 text-white" />
//                         </div>
//                         <span className="text-lg">{item.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
//                       <Zap className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-white">Skills & Interests</h3>
//                   </div>
//                   <div className="flex flex-wrap gap-3">
//                     {['Photography', 'Digital Art', 'Travel', 'Nature', 'Portrait', 'Landscape', 'Adobe Creative Suite', 'Drone Photography', 'Video Editing', 'Music Production'].map((skill, index) => (
//                       <span key={skill} className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white px-4 py-2 rounded-full text-sm border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {(activeTab === 'photos' || activeTab === 'videos') && (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {posts.filter(post => activeTab === 'photos' ? post.type === 'photo' : post.type === 'video').concat(posts.filter(post => activeTab === 'photos' ? post.type === 'photo' : post.type === 'video')).map((post, index) => (
//                   <div key={index} className="aspect-square overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
//                     <div className="relative w-full h-full">
//                       <img 
//                         src={post.image} 
//                         alt={`${activeTab.slice(0, -1)} ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       {activeTab === 'videos' && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
//                           <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
//                             <Video className="w-6 h-6 text-white" />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }