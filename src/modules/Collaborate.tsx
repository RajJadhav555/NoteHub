// @ts-ignore
import React, { useState, useEffect, useRef } from "react";
console.log("Collaborate.tsx is loading...");
import { 
  Video, Users, MessageSquare, File, Paperclip, Send, X, 
  CircleHelp as HelpCircle, Mic, MicOff, VideoOff, PhoneOff, 
  Plus, Search, Phone, Settings, Maximize2
} from "lucide-react/dist/esm/lucide-react";
import { Buffer } from 'buffer';

// @ts-ignore
import { io } from "socket.io-client";
// @ts-ignore
import SimplePeer from "simple-peer";

// @ts-ignore
class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) { return { hasError: true, error }; }

  componentDidCatch(error, errorInfo) { console.error("Collaborate Error:", error, errorInfo); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500">
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Polyfill global, process and Buffer for simple-peer
if (typeof window !== 'undefined') {
    (window as any).global = window;
    (window as any).process = (window as any).process || { env: { DEBUG: undefined }, nextTick: (cb: any) => setTimeout(cb, 0) };
    (window as any).Buffer = Buffer;
}

const API_BASE_URL = '/api';

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  subject: string;
  creator_name: string;
  creator_id?: number;
  member_count: number;
  is_member?: boolean;
}

interface Partner {
  id: number;
  name: string;
  department: string;
  points: number;
}

interface Message {
  id?: number;
  user: string;
  message: string;
  time: string;
  avatar: string;
  type?: 'text' | 'file';
  fileName?: string;
}

const StudyTimer = ({ isActive, isLinked, startTime }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (isLinked && startTime) {
      // Sync with the shared start time
      const updateSync = () => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setSeconds(diff > 0 ? diff : 0);
      };
      updateSync();
      interval = setInterval(updateSync, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isActive, isLinked, startTime]);

  const formatTime = (ts: number) => {
    const h = Math.floor(ts / 3600);
    const m = Math.floor((ts % 3600) / 60);
    const s = ts % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isActive && !isLinked) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-sm border shadow-inner transition-colors duration-500 ${isLinked ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'}`}>
      <span className={`animate-pulse w-2 h-2 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] ${isLinked ? 'bg-rose-500' : 'bg-red-500'}`} />
      {isLinked && <span className="text-[10px] mr-1 uppercase font-sans tracking-tight">Focus Link</span>}
      {formatTime(seconds)}
    </div>
  );
};

export function CollaborationPage({ userProfile }) {
  console.log("CollaborationPage rendering...", userProfile);
  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("");
  const [activeGroupCall, setActiveGroupCall] = useState<string | null>(null);
  const [isFullScreenCall, setIsFullScreenCall] = useState<boolean>(false);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [channelMessages, setChannelMessages] = useState<Message[]>([]);
  
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showGroupAdminModal, setShowGroupAdminModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [helpSubject, setHelpSubject] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [emailToAdd, setEmailToAdd] = useState("");

  // Invite system state
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedInvites, setSelectedInvites] = useState<number[]>([]);
  const [pendingGroupInvites, setPendingGroupInvites] = useState<any[]>([]);
  const [myPendingInvites, setMyPendingInvites] = useState<any[]>([]);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Call state
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callerId, setCallerId] = useState("");
  
  const [videoCallData, setVideoCallData] = useState<any>({
      isActive: false,
      initiator: false,
      userToCall: null,
      signal: null,
      isAudioOnly: false
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChannelRef = useRef("");

  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  // Link-Unlink Focus State
  const [isFocusLinked, setIsFocusLinked] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);
  const [activeFocusUsers, setActiveFocusUsers] = useState<string[]>([]);
  const isFocusLinkedRef = useRef(false);

  useEffect(() => {
    isFocusLinkedRef.current = isFocusLinked;
  }, [isFocusLinked]);

  const groupChannels = studyGroups.filter((g: any) => g.is_member).map((g: any) => g.name);
  const channels = [...groupChannels];

  useEffect(() => {
    loadStudyGroups();
    loadOnlineCount();
    if (userProfile?.id) loadMyPendingInvites();

    // Poll online users every 30s so the sidebar stays current
    const onlinePoll = setInterval(loadOnlineCount, 30000);
    return () => clearInterval(onlinePoll);
  }, [userProfile?.id]);

  // Socket init
  useEffect(() => {
    // @ts-ignore
    const SOCKET_URL = window.location.hostname.includes('vercel.app') 
        ? 'https://rajdjadhav-notehub-backend.hf.space'
        : API_BASE_URL.replace('/api', '');

    socketRef.current = io(SOCKET_URL, {
        query: { userId: userProfile?.id, userName: userProfile?.name },
        transports: ['websocket', 'polling']
    });

    socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
        // Refresh online users immediately on connect
        loadOnlineCount();
        // Re-join active room on reconnect so focus events aren't lost
        if (activeChannelRef.current) {
            socketRef.current.emit("join_room", activeChannelRef.current);
        }
        if (userProfile?.id) {
            socketRef.current.emit("join_room", String(userProfile.id));
        }
    });

    socketRef.current.on("receive_message", (data) => {
        if (data.room === activeChannelRef.current) {
            setChannelMessages((prev) => [...prev, {
                id: Date.now(),
                user: data.user,
                message: data.message,
                time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: data.avatar,
                type: data.type,
                fileName: data.fileName
            }]);
            scrollToBottom();
        }
    });
    
    socketRef.current.on("call_user", (data) => {
        setIncomingCall(true);
        setCallerName(data.name || "Unknown");
        setCallerSignal(data.signal);
        setCallerId(data.from);
    });

    socketRef.current.on("call_accepted", (signal) => {
        setCallAccepted(true);
        if (connectionRef.current) {
            connectionRef.current.signal(signal);
        }
    });

    socketRef.current.on("focus_link_started", (data) => {
        console.log("🚀 Received focus_link_started:", data, "Current activeChannelRef:", activeChannelRef.current);
        if (data.room === activeChannelRef.current) {
            setIsFocusLinked(true);
            setFocusStartTime(data.startTime);
            setActiveFocusUsers((prev) => [...new Set([...prev, data.user])]);
            
            // Add system message
            setChannelMessages((prev) => [...prev, {
                id: Date.now(),
                user: "System",
                message: `🎯 ${data.user} started a Focused Study Link! All members are encouraged to join and stay on this tab.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: "🤖",
                type: 'text'
            }]);
        }
    });

    // Real-time online status updates
    socketRef.current.on("online_status_changed", () => {
        loadOnlineCount();
    });

    socketRef.current.on("focus_link_broken", (data) => {
        console.log("💔 Received focus_link_broken:", data, "Current activeChannelRef:", activeChannelRef.current);
        if (data.room === activeChannelRef.current) {
            setActiveFocusUsers((prev) => prev.filter(u => u !== data.user));
            
            // Add system message
            setChannelMessages((prev) => [...prev, {
                id: Date.now(),
                user: "System",
                message: `⚠️ ${data.user}'s focus link was broken (${data.reason}).`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: "🤖",
                type: 'text'
            }]);

            if (data.user === userProfile?.name) {
                setIsFocusLinked(false);
                setFocusStartTime(null);
            }
        }
    });

    return () => {
        socketRef.current.disconnect();
    };
  }, [userProfile?.id]); // Socket persists across channel changes; handlers use activeChannelRef

  useEffect(() => {
    if (socketRef.current) {
        if (userProfile?.id) socketRef.current.emit("join_room", userProfile.id); 
        socketRef.current.emit("join_room", activeChannel);
    }
    loadChannelMessages(activeChannel);
    
    // Reset focus state when switching channels
    console.log("🔄 Channel switched to:", activeChannel, "- Resetting focus state");
    setIsFocusLinked(false);
    setFocusStartTime(null);
    setActiveFocusUsers([]);
  }, [activeChannel]);

  const startFocusLink = () => {
      console.log("👆 startFocusLink called. Room:", activeChannel, "Socket:", socketRef.current?.id);
      if (!activeChannel) return;
      const startTime = Date.now();
      socketRef.current.emit("start_focus_link", {
          room: activeChannel,
          user: userProfile?.name || "Anonymous",
          startTime
      });
  };

  const breakFocusLink = (reason: string) => {
      console.log("⏹️ breakFocusLink called:", reason, "Room:", activeChannelRef.current);
      if (!activeChannelRef.current || !isFocusLinkedRef.current) return;
      socketRef.current.emit("break_focus_link", {
          room: activeChannelRef.current,
          user: userProfile?.name || "Anonymous",
          reason
      });
  };

  // Tab Abort / Focus Breaking Logic
  useEffect(() => {
    if (!isFocusLinked) return;

    const handleVisibilityChange = () => {
        if (document.hidden && isFocusLinkedRef.current) {
            breakFocusLink("Tab switched / Window minimized");
        }
    };

    const handleBlur = () => {
        if (isFocusLinkedRef.current) {
            // Small delay to prevent accidental breakage from minor system popups
            setTimeout(() => {
                if (!document.hasFocus() && isFocusLinkedRef.current) {
                    breakFocusLink("Window focus lost");
                }
            }, 1000);
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleBlur);
    };
  }, [isFocusLinked, activeChannel]);

  // Tab Abort Logic removed to allow background running

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadStudyGroups = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups?userId=${userProfile?.id || -1}`);
      if (res.ok) {
        const data = await res.json();
        setStudyGroups(data);
      }
    } catch (e) {
      console.error("Failed to load study groups", e);
    }
  };

  const loadOnlineCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/collaborators`);
      if (res.ok) {
        const data = await res.json();
        const online = data.filter((u: any) => u.is_online && u.id !== userProfile?.id);
        setOnlineUsers(online);
        setOnlineCount(online.length);
      }
    } catch (e) {
      console.error("Failed to load online count", e);
    }
  };

  const loadChannelMessages = async (channel: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/group/${channel}`);
      if (res.ok) {
        const data = await res.json();
        setChannelMessages(
          data.map((m: any) => ({
            id: m.id,
            user: m.user_name,
            message: m.message,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            avatar: m.user_name?.[0] || "?",
          }))
        );
        scrollToBottom();
      }
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
        room: activeChannel,
        user: userProfile?.name || "Anonymous",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: userProfile?.name?.[0] || "?",
        type: 'text'
    };

    socketRef.current.emit("send_message", msgData);

    try {
      await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile?.id || 0,
          userName: userProfile?.name || "Anonymous",
          message: newMessage,
          groupName: activeChannel,
        }),
      });
      setNewMessage("");
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const findPartners = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/partners`);
      if (res.ok) {
        const partners: Partner[] = await res.json();
        
        // Filter out the current user
        const otherPartners = partners.filter(p => !userProfile || String(p.id) !== String(userProfile.id));
        
        const partnerList = otherPartners.length > 0
            ? otherPartners.map((p) => `• ${p.name} (${p.points} pts)`).join("\n")
            : "No online study partners at the moment.";
        alert(`🟢 Online Study Partners:\n\n${partnerList}\n\nUse the chat to connect with them!`);
      }
    } catch (e) {
      alert("Failed to find partners. Please try again.");
    }
  };

  // --- Calling Logic ---

  const startCallMedia = async (isAudioOnly: boolean) => {
      try {
          const currentStream = await navigator.mediaDevices.getUserMedia({
              video: !isAudioOnly,
              audio: true
          });
          setStream(currentStream);
          setIsVideoOff(isAudioOnly);
          if (userVideo.current) {
              userVideo.current.srcObject = currentStream;
          }
          return currentStream;
      } catch (err) {
          console.error("Media error", err);
          // If the device is already in use (common in local testing with 2 tabs/browsers),
          // fallback to a fake stream or just alert the user prominently.
          if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
              alert("Your Camera or Microphone is already in use by another tab or application.\\n\\nFor local development, WebRTC video/audio cannot be shared across multiple browsers simultaneously on the same PC. Continuing without local media...");
              
              // Create a blank/fake canvas stream as a fallback so the WebRTC connection doesn't instantly die.
              const canvas = document.createElement('canvas');
              canvas.width = 640;
              canvas.height = 480;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                  ctx.fillStyle = '#27272a'; // stone-800
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.fillStyle = '#a1a1aa'; // stone-400
                  ctx.font = '30px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText('Camera in use', canvas.width/2, canvas.height/2);
              }
              const canvasStream = canvas.captureStream(15); // 15 FPS
              
              // Add a silent audio track
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioCtx.createOscillator();
              const dst = oscillator.connect(audioCtx.createMediaStreamDestination());
              oscillator.start();
              const audioTrack = (dst as any).stream.getAudioTracks()[0];
              audioTrack.enabled = false; // mute it
              canvasStream.addTrack(audioTrack);

              setStream(canvasStream);
              setIsVideoOff(true);
              if (userVideo.current) {
                  userVideo.current.srcObject = canvasStream;
              }
              return canvasStream;
          }
          
          alert("Could not access microphone/camera. Please check your permissions.");
          return null;
      }
  };

  const initiateCall = async (targetUserId, isAudioOnly = false) => {
      const currentStream = await startCallMedia(isAudioOnly);
      if (!currentStream) return;

      setVideoCallData({
          isActive: true,
          initiator: true,
          userToCall: targetUserId,
          signal: null,
          isAudioOnly
      });

      const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: currentStream,
      });

      peer.on("signal", (data) => {
          socketRef.current.emit("call_user", {
              userToCall: targetUserId,
              signalData: data,
              from: socketRef.current.id, // Using socket ID purely for reply routing
              name: userProfile?.name || "Anonymous"
          });
      });

      peer.on("stream", (remoteStream) => {
          if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
      });

      connectionRef.current = peer;
  };
  
  const acceptCall = async () => {
      setIncomingCall(false);
      const currentStream = await startCallMedia(false); // Can adapt to audio only
      if (!currentStream) return;

      setCallAccepted(true);
      setVideoCallData({
          isActive: true,
          initiator: false,
          userToCall: callerId,
          signal: callerSignal,
          isAudioOnly: false
      });

      const peer = new SimplePeer({
          initiator: false,
          trickle: false,
          stream: currentStream,
      });

      peer.on("signal", (data) => {
         socketRef.current.emit("answer_call", { signal: data, to: callerId });
      });

      peer.on("stream", (remoteStream) => {
          if (partnerVideo.current) partnerVideo.current.srcObject = remoteStream;
      });

      peer.signal(callerSignal);
      connectionRef.current = peer;
  };

  const rejectCall = () => setIncomingCall(false);

  const handleEndCall = () => {
      setCallAccepted(false);
      setVideoCallData({ isActive: false, initiator: false, userToCall: null, signal: null });
      if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
      }
      if (connectionRef.current) {
          connectionRef.current.destroy();
      }
  };

  const toggleMute = () => {
      if (stream) {
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack) {
              audioTrack.enabled = isMuted; // inverted logic
              setIsMuted(!isMuted);
          }
      }
  };

  const toggleVideo = () => {
      if (stream) {
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack) {
              videoTrack.enabled = isVideoOff; // inverted logic
              setIsVideoOff(!isVideoOff);
          }
      }
  };

  // --- Utility actions ---
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.png';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            const fileMsg = {
                userId: userProfile?.id || 0,
                userName: userProfile?.name || "Anonymous",
                message: `Shared a file: ${file.name}`,
                groupName: activeChannel,
                type: 'file',
                fileName: file.name
            };
             setChannelMessages(prev => [...prev, {
                id: Date.now(),
                user: fileMsg.userName,
                message: fileMsg.message,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                avatar: fileMsg.userName[0] || '?',
                type: 'file',
                fileName: fileMsg.fileName
            }]);
            scrollToBottom();
        }
    };
    input.click();
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          description: `Study group for ${newGroupSubject || "general topics"}`,
          subject: newGroupSubject || "General",
          creatorId: userProfile?.id || 0,
        }),
      });
      
      if (!res.ok) {
        let errData: any = {};
        try { errData = await res.json(); } catch (e) {}
        throw new Error(errData.error || 'Failed to create group');
      }

      const created = await res.json();
      // Send invites to selected students immediately
      if (selectedInvites.length > 0 && created.id) {
        await fetch(`${API_BASE_URL}/collaboration/groups/${created.id}/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requesterId: userProfile?.id || 0, userIds: selectedInvites }),
        });
      }
      setShowCreateGroupModal(false);
      setNewGroupName("");
      setNewGroupSubject("");
      setSelectedInvites([]);
      setStudentSearch("");
      loadStudyGroups();
    } catch (e: any) {
      alert(e.message || "Failed to create group. Please try again.");
    }
  };


  const handleJoinGroup = async (groupId: number, groupName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${groupId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userProfile?.id || 0 }),
      });
      if (res.ok) {
        loadStudyGroups();
        setActiveChannel(groupName);
      }
    } catch (e) {
      alert("Failed to join group. Please try again.");
    }
  };

  const handleSubmitHelp = async () => {
    if (!helpSubject.trim() || !helpMessage.trim()) return alert("Please fill in both subject and message.");
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile?.id || 0,
          userName: userProfile?.name || "Anonymous",
          subject: helpSubject,
          message: helpMessage,
        }),
      });
      if (res.ok) {
        setShowHelpModal(false);
        setHelpSubject("");
        setHelpMessage("");
        alert("🆘 Help request submitted! Other students will be notified.");
      }
    } catch (e) {
      alert("Failed to submit help request. Please try again.");
    }
  };

  const activeGroup = studyGroups.find(g => g.name === activeChannel);
  const isCreator = activeGroup?.creator_id === userProfile?.id;

  const loadGroupMembers = async (groupId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${groupId}/members`);
      if (res.ok) setGroupMembers(await res.json());
    } catch (e) { console.error("Failed to load group members", e); }
  };

  const loadAllStudents = async (groupId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/students?excludeGroupId=${groupId}`);
      if (res.ok) setAllStudents(await res.json());
    } catch (e) { console.error("Failed to load students", e); }
  };

  const loadPendingGroupInvites = async (groupId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${groupId}/invites`);
      if (res.ok) setPendingGroupInvites(await res.json());
    } catch (e) { console.error("Failed to load group invites", e); }
  };

  const loadMyPendingInvites = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/invites/pending?userId=${userProfile?.id}`);
      if (res.ok) setMyPendingInvites(await res.json());
    } catch (e) { console.error('Failed to load my invites', e); }
  };

  useEffect(() => {
    if (showGroupAdminModal && activeGroup) {
      loadGroupMembers(activeGroup.id);
      loadAllStudents(activeGroup.id);
      loadPendingGroupInvites(activeGroup.id);
      setSelectedInvites([]);
      setStudentSearch("");
      setInviteStatus(null);
    }
  }, [showGroupAdminModal, activeGroup]);

  const toggleInviteSelect = (uid: number) => {
    setSelectedInvites(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);
  };

  const handleSendInvites = async () => {
    if (!selectedInvites.length || !activeGroup) return;
    setInviteStatus('sending');
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${activeGroup.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: userProfile?.id || 0, userIds: selectedInvites }),
      });
      if (res.ok) {
        setSelectedInvites([]);
        setInviteStatus('sent');
        loadPendingGroupInvites(activeGroup.id);
        loadAllStudents(activeGroup.id);
        setTimeout(() => setInviteStatus(null), 3000);
      } else {
        const d = await res.json();
        setInviteStatus('error');
        alert(d.error || 'Failed to send invites.');
      }
    } catch (e) { setInviteStatus('error'); alert('Failed to send invites.'); }
  };

  const handleAcceptInvite = async (inviteId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/invites/${inviteId}/accept`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile?.id }),
      });
      if (res.ok) { loadMyPendingInvites(); loadStudyGroups(); }
    } catch (e) { alert('Failed to accept invite.'); }
  };

  const handleRejectInvite = async (inviteId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/invites/${inviteId}/reject`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile?.id }),
      });
      if (res.ok) loadMyPendingInvites();
    } catch (e) { alert('Failed to reject invite.'); }
  };

  const handleAddMember = async () => {
    if (!emailToAdd.trim() || !activeGroup) return;
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${activeGroup.id}/add-member`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: userProfile?.id || 0, emailToAdd }),
      });
      const data = await res.json();
      if (res.ok) { setEmailToAdd(""); loadGroupMembers(activeGroup.id); loadStudyGroups(); }
      else alert(data.error || "Failed to add member.");
    } catch (e) { alert("Failed to add member."); }
  };

  const handleKickMember = async (targetUserId: number) => {
    if (!activeGroup || !confirm("Are you sure you want to kick this member?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${activeGroup.id}/kick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: userProfile?.id || 0, targetUserId }),
      });
      if (res.ok) {
        loadGroupMembers(activeGroup.id);
        loadStudyGroups();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to kick member.");
      }
    } catch (e) {
      alert("Failed to kick member.");
    }
  };

  const handleDeleteGroup = async () => {
    if (!activeGroup || !confirm("DANGER: Are you sure you want to completely delete this group? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/collaboration/groups/${activeGroup.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: userProfile?.id || 0 }),
      });
      if (res.ok) {
        setShowGroupAdminModal(false);
        setActiveChannel("");
        loadStudyGroups();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete group.");
      }
    } catch (e) {
      alert("Failed to delete group.");
    }
  };

  const filteredStudents = allStudents.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="w-full h-screen overflow-hidden bg-stone-100 dark:bg-stone-950 pt-16 flex flex-col">
      {/* Incoming Invites Notification Bar */}
      {myPendingInvites.length > 0 && (
        <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            You have {myPendingInvites.length} pending group invite{myPendingInvites.length > 1 ? 's' : ''}
          </div>
          <button onClick={() => setShowInvitePanel(!showInvitePanel)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition font-semibold">
            {showInvitePanel ? 'Hide' : 'View Invites'}
          </button>
        </div>
      )}
      {showInvitePanel && myPendingInvites.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800 px-4 py-3 space-y-2 shrink-0 z-20">
          {myPendingInvites.map(inv => (
            <div key={inv.id} className="flex items-center justify-between bg-white dark:bg-stone-900 rounded-xl px-4 py-2.5 border border-indigo-100 dark:border-indigo-800 shadow-sm">
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-white">{inv.group_name} <span className="text-indigo-500 font-normal text-xs">• {inv.subject}</span></p>
                <p className="text-xs text-stone-500">Invited by <span className="font-semibold">{inv.inviter_name}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRejectInvite(inv.id)} className="px-3 py-1.5 text-xs text-stone-500 hover:text-red-500 border border-stone-200 dark:border-stone-700 rounded-lg hover:border-red-300 transition">Decline</button>
                <button onClick={() => handleAcceptInvite(inv.id)} className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-sm">Accept & Join</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Title Bar */}
      <div className="px-6 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm z-10 flex justify-between items-center shrink-0">
          <div>
              <h1 className="text-xl font-bold font-heading text-stone-900 dark:text-white flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Real-Time Collaboration
              </h1>
          </div>
          <div className="flex gap-3">
              <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                  <HelpCircle className="w-4 h-4"/> SOS
              </button>
          </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">
          {/* Left Sidebar (Channels & Groups) */}
          <div className="w-80 flex-shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col z-10 transition-all duration-300">
              
              <div className="p-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-stone-800 dark:text-stone-200">Chats & Groups</h2>
                      <div className="flex gap-1">
                          <button onClick={findPartners} className="p-2 text-stone-500 hover:text-purple-600 bg-stone-50 dark:bg-stone-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition" title="Find Online Partners">
                              <Search className="w-4 h-4"/>
                          </button>
                          <button onClick={() => setShowCreateGroupModal(true)} className="p-2 text-stone-500 hover:text-indigo-600 bg-stone-50 dark:bg-stone-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition" title="Create Group">
                              <Plus className="w-4 h-4"/>
                          </button>
                      </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-100 dark:bg-stone-950/50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                    />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                      <div className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2 px-2 flex justify-between">
                          <span>Study Groups</span>
                          <span className="bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded text-[10px]">{studyGroups.length}</span>
                      </div>
                      
                      {studyGroups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(group => (
                          <div 
                              key={group.id}
                              onClick={() => group.is_member ? setActiveChannel(group.name) : handleJoinGroup(group.id, group.name)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition mb-1 ${activeChannel === group.name ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300 border border-transparent'}`}
                          >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${activeChannel === group.name ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                                  {group.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm truncate flex justify-between">
                                      {group.name}
                                      {!group.is_member && <span className="text-xs text-indigo-500">Join</span>}
                                  </div>
                                  <div className="text-xs text-stone-500 truncate flex items-center gap-1">
                                      <Users className="w-3 h-3"/> {group.member_count} members
                                  </div>
                              </div>
                          </div>
                      ))}
                      
                      {/* Active Online Users specifically for 1-1 calls */}
                      <div className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-6 mb-2 px-2 flex justify-between">
                          <span>Online Students</span>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 px-1.5 py-0.5 rounded text-[10px]">{onlineCount}</span>
                      </div>
                      {onlineUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) && u.id !== userProfile?.id).map(u => (
                          <div key={u.id} className="flex justify-between items-center px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition">
                              <div className="flex items-center gap-2 min-w-0">
                                  <div className="relative shrink-0">
                                      <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300">{u.name[0]}</div>
                                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white dark:border-stone-900 rounded-full"></span>
                                  </div>
                                  <div className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate max-w-[90px]">{u.name}</div>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                  <button onClick={() => initiateCall(u.id, true)} title="Audio Call" className="p-1.5 text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition"><Phone className="w-3.5 h-3.5"/></button>
                                  <button onClick={() => initiateCall(u.id, false)} title="Video Call" className="p-1.5 text-pink-500 hover:text-pink-600 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 rounded-lg transition"><Video className="w-3.5 h-3.5"/></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

          {/* Right Main Chat Area */}
          <div className="flex-1 flex flex-col bg-stone-50 dark:bg-[#0a0a0a] relative before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] before:opacity-[0.03] dark:before:opacity-[0.02] before:pointer-events-none z-0">
             
             {/* Chat Header */}
             {activeChannel ? (
               <div className="flex-1 flex flex-col h-full relative">
                 <div className="h-16 px-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex justify-between items-center z-20 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 font-bold flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                            {activeChannel.substring(0, 2).toUpperCase()}
                        </div>
                    <div>
                        <h3 className="font-bold text-stone-900 dark:text-white capitalize">{activeChannel}</h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Session
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <StudyTimer 
                        isActive={videoCallData.isActive && callAccepted} 
                        isLinked={isFocusLinked}
                        startTime={focusStartTime}
                    />
                    
                    {activeChannel && (
                        <button 
                            onClick={() => isFocusLinked ? breakFocusLink("Manual disconnect") : startFocusLink()}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                                isFocusLinked 
                                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                            title={isFocusLinked ? "Break Focus Link" : "Start Focus Link"}
                        >
                            <Paperclip className={`w-4 h-4 ${isFocusLinked ? 'rotate-45' : ''}`} />
                            {isFocusLinked ? 'Linked' : 'Link Focus'}
                        </button>
                    )}

                    {activeFocusUsers.length > 0 && (
                        <div className="flex -space-x-2 overflow-hidden">
                            {activeFocusUsers.map((u, i) => (
                                <div key={i} title={`${u} is in Focus Mode`} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-stone-900 bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                    {u[0]}
                                </div>
                            ))}
                        </div>
                    )}
                    {isCreator && (
                        <button 
                            onClick={() => setShowGroupAdminModal(true)} 
                            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition" 
                            title="Group Settings"
                        >
                            <Settings className="w-5 h-5"/>
                        </button>
                    )}
                    {/* Group Video Calling via Jitsi Meet */}
                    <button onClick={() => setActiveGroupCall(activeGroupCall === 'audio' ? null : 'audio')} className={`p-2 rounded-full transition ${activeGroupCall === 'audio' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'text-stone-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`} title="Toggle Group Audio Call"><Phone className="w-5 h-5"/></button>
                    <button onClick={() => setActiveGroupCall(activeGroupCall === 'video' ? null : 'video')} className={`p-2 rounded-full transition ${activeGroupCall === 'video' ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/30' : 'text-stone-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20'}`} title="Toggle Group Video Call"><Video className="w-5 h-5"/></button>
                </div>
             </div>

             {/* Group Call Interface Overlay (Jitsi) */}
             {activeGroupCall && activeGroup && (
                 <div className={`bg-stone-900 border-b border-stone-800 flex gap-0 shrink-0 shadow-xl overflow-hidden animate-fade-in transition-all relative ${isFullScreenCall ? 'fixed inset-0 z-[100] w-full h-full' : 'z-10 h-[400px]'}`}>
                     <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded uppercase tracking-wider z-20 font-bold backdrop-blur-sm shadow flex items-center gap-2">
                        <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
                        Live Group Session
                     </div>
                     <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
                         <button onClick={() => setIsFullScreenCall(!isFullScreenCall)} className="p-2 bg-black/60 text-white hover:bg-stone-700 rounded transition backdrop-blur-sm shadow" title={isFullScreenCall ? "Exit Fullscreen" : "Fullscreen"}>
                            <Maximize2 className="w-4 h-4"/>
                         </button>
                         <button onClick={() => { setActiveGroupCall(null); setIsFullScreenCall(false); }} className="p-2 bg-black/60 text-white hover:bg-red-500 rounded transition backdrop-blur-sm shadow" title="Leave Call">
                            <X className="w-4 h-4"/>
                         </button>
                     </div>
                     <iframe 
                        allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                        allowFullScreen
                        src={`https://meet.jit.si/NoteHub-Group-${activeGroup.id}#config.prejoinPageEnabled=false&userInfo.displayName="${encodeURIComponent(userProfile?.name || 'Student')}"${activeGroupCall === 'audio' ? '&config.startAudioOnly=true&config.startWithVideoMuted=true' : ''}`}
                        className="w-full h-full border-0"
                     />
                 </div>
             )}

             {/* Inline Call Interface Overlay (1-on-1) */}
             {videoCallData.isActive && (
                 <div className="bg-stone-900 border-b border-stone-800 p-4 flex gap-4 shrink-0 shadow-xl overflow-hidden animate-fade-in z-10 transition-all h-[260px] relative">
                     <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded uppercase tracking-wider z-20 font-bold backdrop-blur-sm shadow flex items-center gap-2">
                        <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
                        Live Study Session
                     </div>
                     <div className="flex-1 relative bg-stone-800 rounded-xl overflow-hidden border border-stone-700 shadow-md">
                         {callAccepted ? (
                             <video ref={partnerVideo} autoPlay playsInline className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-800/50">
                                 <div className="w-16 h-16 rounded-full bg-stone-700 animate-pulse mb-3 flex items-center justify-center"><Phone className="w-6 h-6 text-stone-500"/></div>
                                 Calling...
                             </div>
                         )}
                         <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs backdrop-blur-sm">Partner</div>
                     </div>
                     <div className="w-[30%] min-w-[200px] relative bg-stone-800 rounded-xl overflow-hidden border border-stone-700 shadow-md">
                         <video ref={userVideo} muted autoPlay playsInline className={`w-full h-full object-cover mirror ${isVideoOff ? 'hidden' : ''}`} />
                         {isVideoOff && (
                             <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-500 flex-col">
                                 <VideoOff className="w-8 h-8 mb-2 opacity-50"/>
                                 <span className="text-xs">Camera Off</span>
                             </div>
                         )}
                         <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs backdrop-blur-sm">You</div>
                     </div>
                     
                     {/* Call Controls Floating */}
                     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-stone-700/50 shadow-2xl z-20">
                         <button onClick={toggleMute} className={`p-3 rounded-full transition ${isMuted ? 'bg-red-500/90 text-white' : 'bg-stone-700/80 hover:bg-stone-600 text-stone-200'}`}>
                             {isMuted ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                         </button>
                         <button onClick={toggleVideo} className={`p-3 rounded-full transition ${isVideoOff ? 'bg-red-500/90 text-white' : 'bg-stone-700/80 hover:bg-stone-600 text-stone-200'}`}>
                             {isVideoOff ? <VideoOff className="w-5 h-5"/> : <Video className="w-5 h-5"/>}
                         </button>
                         <button onClick={handleEndCall} className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-500/20">
                             <PhoneOff className="w-5 h-5"/>
                         </button>
                     </div>
                 </div>
             )}

             {/* Chat Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scrollbar-hide">
                 <div className="text-center py-4">
                     <span className="bg-stone-200 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400 text-xs px-3 py-1 rounded-full border border-stone-300 dark:border-stone-700 backdrop-blur-sm shadow-sm">
                         This is the start of the #{activeChannel} chat.
                     </span>
                 </div>
                 {channelMessages.map((msg, idx) => {
                     const isMine = msg.user === userProfile?.name;
                     return (
                         <div key={msg.id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                             <div className={`flex items-end max-w-[75%] gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                                 {!isMine && (
                                     <div className="w-7 h-7 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 border border-purple-200 dark:border-purple-800 rounded-full flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300 shadow-sm shrink-0">
                                         {msg.avatar}
                                     </div>
                                 )}
                                 <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                     {!isMine && <span className="text-xs text-stone-500 dark:text-stone-400 mb-1 ml-1 font-medium">{msg.user}</span>}
                                     <div className={`p-3 rounded-2xl shadow-sm text-sm ${isMine ? 'bg-indigo-600 text-white rounded-br-sm shadow-indigo-500/20' : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-bl-sm'}`}>
                                        {msg.type === 'file' ? (
                                            <div className="flex items-center gap-2 font-medium cursor-pointer hover:underline opacity-90">
                                               <File className="w-4 h-4" /> {msg.fileName}
                                            </div>
                                        ) : (
                                            msg.message
                                        )}
                                     </div>
                                     <span className="text-[10px] text-stone-400 mt-1 mx-1">{msg.time}</span>
                                 </div>
                             </div>
                         </div>
                     );
                 })}
                 <div ref={messagesEndRef} className="h-4"></div>
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 z-20 shrink-0">
                 <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-950/50 rounded-full border border-stone-200 dark:border-stone-800 px-2 py-1 shadow-inner">
                    <button onClick={handleFileUpload} className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition shrink-0" title="Attach file">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder={`Message #${activeChannel}...`}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-3 px-2 text-stone-800 dark:text-stone-200 placeholder-stone-400"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition disabled:opacity-50 shrink-0 shadow-md shadow-indigo-500/20 flex items-center justify-center h-10 w-10"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                 </div>
              </div>
             </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-stone-400">
                    <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select a study group or inline partner to start collaborating.</p>
                </div>
             )}
         </div>
      </div>

       {/* INCOMING CALL OVERLAY */}
       {incomingCall && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-bounce-in">
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center border border-stone-200 dark:border-stone-800 content-center">
                  <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex flex-col items-center justify-center mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                      <Phone className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">{callerName}</h3>
                  <p className="text-stone-500 dark:text-stone-400 mb-8 font-medium">Incoming study call...</p>
                  
                  <div className="flex gap-6 justify-center">
                      <button onClick={rejectCall} className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800/50 flex flex-col items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-105 transition shadow-lg">
                          <PhoneOff className="w-6 h-6" />
                      </button>
                      <button onClick={acceptCall} className="w-16 h-16 rounded-full bg-emerald-500 text-white border border-emerald-600 flex flex-col items-center justify-center hover:bg-emerald-600 hover:scale-105 transition shadow-xl shadow-emerald-500/30 animate-pulse">
                          <Video className="w-6 h-6" />
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* MODALS */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-white">Create Study Group</h3>
                <p className="text-xs text-stone-500 mt-0.5">Set up your group and invite students right away</p>
              </div>
              <button onClick={() => { setShowCreateGroupModal(false); setSelectedInvites([]); setStudentSearch(""); }} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"><X className="w-5 h-5"/></button>
            </div>

            <div className="px-6 pb-2 space-y-3 shrink-0">
              <input
                type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group Name *"
                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-stone-900 dark:text-white placeholder-stone-400"
              />
              <input
                type="text" value={newGroupSubject} onChange={(e) => setNewGroupSubject(e.target.value)}
                placeholder="Subject (optional, e.g. Data Structures)"
                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition text-stone-900 dark:text-white placeholder-stone-400"
              />
            </div>

            {/* Divider */}
            <div className="px-6 py-2 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">Invite Students</span>
                {selectedInvites.length > 0 && <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{selectedInvites.length} selected</span>}
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
              </div>
            </div>

            {/* Student Picker */}
            <div className="px-6 pb-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text" placeholder="Search by name, email or class..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  onFocus={() => { if (allStudents.length === 0) loadAllStudents(-1); }}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400"
                />
              </div>
            </div>

            {/* Scrollable student list */}
            <div className="flex-1 overflow-y-auto px-6 pb-2 space-y-1.5 min-h-[140px] max-h-[260px]">
              {allStudents.length === 0 && !studentSearch && (
                <p className="text-center text-stone-400 text-sm py-8">Click the search box to load all registered students.</p>
              )}
              {allStudents.length > 0 && filteredStudents.length === 0 && (
                <p className="text-center text-stone-400 text-sm py-8">No students match your search.</p>
              )}
              {filteredStudents
                .filter(s => String(s.id) !== String(userProfile?.id))
                .map(s => {
                  const selected = selectedInvites.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleInviteSelect(s.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition select-none ${
                        selected
                          ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                        selected ? 'bg-indigo-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}>
                        {selected ? '✓' : s.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">{s.name}</p>
                        <p className="text-xs text-stone-400 truncate">{s.department || 'No class'} · {s.email}</p>
                      </div>
                      {s.is_online && <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" title="Online"></span>}
                    </div>
                  );
              })}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 flex gap-3 shrink-0">
              <button
                onClick={() => { setShowCreateGroupModal(false); setSelectedInvites([]); setStudentSearch(""); }}
                className="flex-1 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition font-medium"
              >Cancel</button>
              <button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition font-semibold disabled:opacity-50"
              >
                {selectedInvites.length > 0 ? `Create & Invite ${selectedInvites.length}` : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}


      {showHelpModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-red-500"/> Get Help</h3>
                 <button onClick={() => setShowHelpModal(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"><X className="w-5 h-5"/></button>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">Submit a help request and other students will be notified immediately.</p>
            <div className="space-y-4">
                <input type="text" value={helpSubject} onChange={(e) => setHelpSubject(e.target.value)} placeholder="Subject (e.g., Math)" className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" />
                <textarea value={helpMessage} onChange={(e) => setHelpMessage(e.target.value)} placeholder="Describe what you need help with..." rows={3} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowHelpModal(false)} className="flex-1 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition font-medium">Cancel</button>
              <button onClick={handleSubmitHelp} disabled={!helpSubject.trim() || !helpMessage.trim()} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transition font-medium disabled:opacity-50">Submit SOS</button>
            </div>
          </div>
        </div>
      )}

      {/* Group Admin Modal */}
      {showGroupAdminModal && activeGroup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in border border-stone-200 dark:border-stone-800">
            <div className="px-6 py-4 flex justify-between items-center border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50">
              <h2 className="text-xl font-bold font-heading text-stone-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500"/>
                Manage Group: {activeGroup.name}
              </h2>
              <button onClick={() => setShowGroupAdminModal(false)} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

              {/* Invite Students Section */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  Invite Students
                  {selectedInvites.length > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{selectedInvites.length} selected</span>
                  )}
                </h3>
                <input
                  type="text" placeholder="Search by name, email, or class..."
                  value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  className="w-full px-4 py-2 mb-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-stone-800 dark:text-stone-200 placeholder-stone-400 text-sm"
                />
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {filteredStudents.length === 0 && (
                    <p className="text-center text-stone-400 text-sm py-4">No students found or everyone is already a member.</p>
                  )}
                  {filteredStudents.map(s => {
                    const selected = selectedInvites.includes(s.id);
                    const isPending = pendingGroupInvites.some(p => p.invitee_id === s.id);
                    return (
                      <div key={s.id}
                        onClick={() => !isPending && toggleInviteSelect(s.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition ${
                          isPending ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 cursor-not-allowed opacity-70' :
                          selected ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' :
                          'border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          selected ? 'bg-indigo-600 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}>
                          {selected ? '✓' : s.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">{s.name}</p>
                          <p className="text-xs text-stone-500 truncate">{s.department || 'No class'} • {s.email}</p>
                        </div>
                        {s.is_online && <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" title="Online"></span>}
                        {isPending && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">Pending</span>}
                      </div>
                    );
                  })}
                </div>
                {selectedInvites.length > 0 && (
                  <button
                    onClick={handleSendInvites}
                    disabled={inviteStatus === 'sending'}
                    className="mt-3 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20 disabled:opacity-60 text-sm"
                  >
                    {inviteStatus === 'sending' ? 'Sending...' : inviteStatus === 'sent' ? '✓ Invites Sent!' : `Send ${selectedInvites.length} Invite${selectedInvites.length > 1 ? 's' : ''}`}
                  </button>
                )}
              </div>

              <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-3 uppercase tracking-wide flex justify-between">
                      Current Members
                      <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-xs">{groupMembers.length}</span>
                  </h3>
                  <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
                      {groupMembers.map(member => {
                          const isOnline = onlineUsers.some(ou => String(ou.id) === String(member.id));
                          return (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
                              <div className="flex items-center gap-3">
                                  <div className="relative">
                                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 font-bold flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs">
                                          {member.name[0]}
                                      </div>
                                      {isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-stone-50 dark:border-stone-800 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" title="Online" />}
                                  </div>
                                  <div>
                                      <div className="text-sm font-bold text-stone-900 dark:text-white leading-tight flex items-center gap-1.5">
                                          {member.name} 
                                          {member.id === activeGroup.creator_id && <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">Admin</span>}
                                      </div>
                                      <div className="text-[10px] text-stone-500 truncate max-w-[150px]">{member.email}</div>
                                  </div>
                              </div>
                              {member.id !== activeGroup.creator_id && (
                                  <button onClick={() => handleKickMember(member.id)} className="text-xs px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium transition">
                                      Kick
                                  </button>
                              )}
                          </div>
                          );
                      })}
                  </div>
              </div>
              
              <div className="pt-4 border-t border-red-200 dark:border-red-900/30">
                  <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Danger Zone</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Deleting the group will remove all members and delete all chat history immediately. This cannot be undone.</p>
                  <button onClick={handleDeleteGroup} className="w-full py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition">
                      Delete Study Group
                  </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}


const CollaborationPageWithBoundary = (props) => {
  return (
    // @ts-ignore
    <ErrorBoundary>
      <CollaborationPage {...props} />
    </ErrorBoundary>
  );
};

export default CollaborationPageWithBoundary;
