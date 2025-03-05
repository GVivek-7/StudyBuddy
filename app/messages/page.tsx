"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Send, Heart, X, MessageCircle, User, Settings, LogOut } from 'lucide-react';

// Mock data for matches and messages
const MATCHES = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    lastMessage: 'Hey, want to study for the physics exam?',
    lastMessageTime: '2 min ago',
    online: true,
    subjects: ['Physics', 'Calculus'],
    unread: 2,
  },
  {
    id: 2,
    name: 'Samantha Lee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    lastMessage: 'I found some great resources for our project',
    lastMessageTime: '1 hour ago',
    online: true,
    subjects: ['Biology', 'Chemistry'],
    unread: 0,
  },
  {
    id: 3,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    lastMessage: 'Are we still meeting at the library tomorrow?',
    lastMessageTime: '3 hours ago',
    online: false,
    subjects: ['Computer Science', 'Statistics'],
    unread: 0,
  },
  {
    id: 4,
    name: 'Olivia Martinez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80',
    lastMessage: 'Thanks for the help with those practice problems!',
    lastMessageTime: 'Yesterday',
    online: false,
    subjects: ['Literature', 'History'],
    unread: 0,
  },
];

const MESSAGES = [
  {
    id: 1,
    senderId: 1,
    text: 'Hey, want to study for the physics exam?',
    timestamp: '10:30 AM',
    isUser: false,
  },
  {
    id: 2,
    senderId: 0, // User
    text: 'Sure! When were you thinking?',
    timestamp: '10:32 AM',
    isUser: true,
  },
  {
    id: 3,
    senderId: 1,
    text: 'How about tomorrow at 3pm? We could meet at the library.',
    timestamp: '10:33 AM',
    isUser: false,
  },
  {
    id: 4,
    senderId: 0, // User
    text: 'That works for me. Should we focus on the chapters from last week?',
    timestamp: '10:35 AM',
    isUser: true,
  },
  {
    id: 5,
    senderId: 1,
    text: 'Yes, especially the quantum mechanics section. I found it really challenging.',
    timestamp: '10:36 AM',
    isUser: false,
  },
  {
    id: 6,
    senderId: 0, // User
    text: 'Same here. I have some practice problems we could work through together.',
    timestamp: '10:38 AM',
    isUser: true,
  },
  {
    id: 7,
    senderId: 1,
    text: 'That sounds perfect! I will bring my notes and textbook.',
    timestamp: '10:40 AM',
    isUser: false,
  },
];

// Potential matches for swiping
const POTENTIAL_MATCHES = [
  {
    id: 101,
    name: 'Jordan Taylor',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    bio: 'Computer Science major with a passion for AI and machine learning. Looking for study partners for algorithm practice.',
    subjects: ['Computer Science', 'Artificial Intelligence', 'Data Structures'],
    university: 'Stanford University',
    studyStyle: 'Visual learner, prefer group discussions',
  },
  {
    id: 102,
    name: 'Riley Morgan',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    bio: 'Pre-med student focusing on biochemistry. I make great study guides and am looking for partners for MCAT prep.',
    subjects: ['Biology', 'Chemistry', 'Organic Chemistry'],
    university: 'UCLA',
    studyStyle: 'Organized, methodical, likes to create detailed notes',
  },
  {
    id: 103,
    name: 'Casey Zhang',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    bio: 'Engineering major with a minor in mathematics. Looking for study partners for calculus and physics.',
    subjects: ['Calculus', 'Physics', 'Engineering'],
    university: 'MIT',
    studyStyle: 'Problem-solving focused, likes to work through examples',
  },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMatch, setSelectedMatch] = useState(MATCHES[0]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(MESSAGES);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [swipedRight, setSwipedRight] = useState<number[]>([]);
  const [swipedLeft, setSwipedLeft] = useState<number[]>([]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        senderId: 0, // User
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleSwipeRight = () => {
    setSwipedRight([...swipedRight, POTENTIAL_MATCHES[currentSwipeIndex].id]);
    handleNextProfile();
  };

  const handleSwipeLeft = () => {
    setSwipedLeft([...swipedLeft, POTENTIAL_MATCHES[currentSwipeIndex].id]);
    handleNextProfile();
  };

  const handleNextProfile = () => {
    if (currentSwipeIndex < POTENTIAL_MATCHES.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    }
  };

  const currentProfile = POTENTIAL_MATCHES[currentSwipeIndex];
  const noMoreProfiles = currentSwipeIndex >= POTENTIAL_MATCHES.length - 1 && 
    (swipedLeft.includes(POTENTIAL_MATCHES[currentSwipeIndex]?.id) || 
     swipedRight.includes(POTENTIAL_MATCHES[currentSwipeIndex]?.id));

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold">StudyBuddy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <div className="w-20 bg-gray-100 border-r flex flex-col items-center py-6 space-y-8">
          <Button
            variant={activeTab === 'discover' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-full"
            onClick={() => setActiveTab('discover')}
          >
            <Heart className="h-6 w-6" />
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-full"
            onClick={() => setActiveTab('messages')}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-full"
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Discover Tab */}
            <TabsContent value="discover" className="flex-1 p-0 m-0">
              <div className="h-full flex flex-col items-center justify-center p-6">
                {!noMoreProfiles ? (
                  <Card className="w-full max-w-md mx-auto overflow-hidden">
                    <div className="relative">
                      <img 
                        src={currentProfile.avatar} 
                        alt={currentProfile.name}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <h3 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                        <p className="text-sm">{currentProfile.university}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="mb-4">{currentProfile.bio}</p>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.subjects.map((subject, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Study Style</h4>
                        <p className="text-sm">{currentProfile.studyStyle}</p>
                      </div>
                    </div>
                    <div className="flex justify-center p-4 space-x-4">
                      <Button 
                        onClick={handleSwipeLeft}
                        variant="outline" 
                        size="icon" 
                        className="h-14 w-14 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <X className="h-8 w-8" />
                      </Button>
                      <Button 
                        onClick={handleSwipeRight}
                        variant="outline" 
                        size="icon" 
                        className="h-14 w-14 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50"
                      >
                        <Heart className="h-8 w-8" />
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">No more profiles</h3>
                    <p className="text-gray-600 mb-6">You've gone through all available profiles. Check back later for more matches!</p>
                    <Button onClick={() => {
                      setCurrentSwipeIndex(0);
                      setSwipedLeft([]);
                      setSwipedRight([]);
                    }}>
                      Reset Profiles (Demo)
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="flex-1 p-0 m-0 flex">
              {/* Matches List */}
              <div className="w-80 border-r overflow-y-auto">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-lg">Messages</h2>
                </div>
                <div>
                  {MATCHES.map((match) => (
                    <div 
                      key={match.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedMatch.id === match.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={match.avatar} alt={match.name} />
                            <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {match.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium truncate">{match.name}</h3>
                            <span className="text-xs text-gray-500">{match.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{match.lastMessage}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.subjects.map((subject, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        {match.unread > 0 && (
                          <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {match.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedMatch.avatar} alt={selectedMatch.name} />
                      <AvatarFallback>{selectedMatch.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedMatch.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedMatch.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          message.isUser 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="flex-1 p-6 m-0">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">John Doe</h2>
                  <p className="text-gray-600">Computer Science • Stanford University</p>
                </div>

                <Card className="mb-6">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">About Me</h3>
                    <p className="text-gray-700 mb-4">
                      I'm a Computer Science major with a focus on AI and machine learning. I'm looking for study partners for algorithm practice and upcoming exams.
                    </p>
                    
                    <h4 className="font-medium text-gray-900 mt-6 mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        Computer Science
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        Artificial Intelligence
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        Data Structures
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">Study Preferences</h4>
                    <p className="text-gray-700">
                      I prefer studying in groups and discussing concepts. I'm a visual learner and like to use diagrams and flowcharts.
                    </p>
                  </div>
                </Card>

                <Card className="mb-6">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Subscription</h3>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-indigo-800">Premium Plan</p>
                          <p className="text-sm text-indigo-600">Unlimited matches and messaging</p>
                        </div>
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Your subscription renews on May 15, 2025</p>
                    <Button variant="outline" className="w-full">Manage Subscription</Button>
                  </div>
                </Card>

                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1">Edit Profile</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setActiveTab('discover')}>Find Study Partners</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}