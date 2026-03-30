import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen,
  Award,
  TrendingUp,
  Eye,
  UserCheck,
  UserX,
  Clock,
  Star,
  Activity,
  Sparkles,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock student data with more details
  const mockStudents = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      enrolledCourses: 3,
      completedCourses: 1,
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      progress: 75,
      avatar: 'RS',
      totalLessons: 45,
      completedLessons: 34,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 98765 43211',
      enrolledCourses: 5,
      completedCourses: 3,
      status: 'active',
      joinedDate: '2024-02-20',
      lastActive: '1 day ago',
      progress: 92,
      avatar: 'PP',
      totalLessons: 68,
      completedLessons: 63,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 98765 43212',
      enrolledCourses: 2,
      completedCourses: 0,
      status: 'inactive',
      joinedDate: '2024-03-10',
      lastActive: '2 weeks ago',
      progress: 35,
      avatar: 'AK',
      totalLessons: 30,
      completedLessons: 11,
      rating: 4.2
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      enrolledCourses: 4,
      completedCourses: 2,
      status: 'active',
      joinedDate: '2024-01-25',
      lastActive: '5 hours ago',
      progress: 88,
      avatar: 'SR',
      totalLessons: 52,
      completedLessons: 46,
      rating: 4.7
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 98765 43214',
      enrolledCourses: 6,
      completedCourses: 4,
      status: 'active',
      joinedDate: '2023-12-05',
      lastActive: '30 minutes ago',
      progress: 95,
      avatar: 'VS',
      totalLessons: 80,
      completedLessons: 76,
      rating: 5.0
    },
    {
      id: 6,
      name: 'Anjali Mehta',
      email: 'anjali.mehta@email.com',
      phone: '+91 98765 43215',
      enrolledCourses: 1,
      completedCourses: 0,
      status: 'active',
      joinedDate: '2024-03-28',
      lastActive: '1 hour ago',
      progress: 15,
      avatar: 'AM',
      totalLessons: 15,
      completedLessons: 2,
      rating: 4.0
    }
  ];

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockStudents.length,
    active: mockStudents.filter(s => s.status === 'active').length,
    inactive: mockStudents.filter(s => s.status === 'inactive').length,
    avgProgress: Math.round(mockStudents.reduce((sum, s) => sum + s.progress, 0) / mockStudents.length)
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 hover:scale-110 transition-transform duration-300">
          <UserCheck size={14} className="mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/50 hover:scale-110 transition-transform duration-300">
        <UserX size={14} className="mr-1" />
        Inactive
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, index }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <div 
        className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
        <div className={`absolute top-0 right-0 w-40 h-40 ${bgColor} opacity-5 rounded-full blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}></div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
              <p className="text-4xl font-bold text-gray-900 tabular-nums">{count}{title.includes('Progress') ? '%' : ''}</p>
            </div>
            <div className={`relative p-4 rounded-2xl ${bgColor} ${color} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
              <Icon size={28} className="relative z-10" />
              <div className={`absolute inset-0 ${bgColor} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Animated Header */}
      <div className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent flex items-center">
              <Users className="mr-3 text-amber-600 animate-pulse" size={32} />
              Students Management
            </h2>
            <p className="text-gray-600 mt-1 flex items-center">
              <Sparkles size={16} className="mr-2 text-amber-500" />
              Manage student enrollments and track progress
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-500"
          index={0}
        />
        <StatCard
          title="Active Students"
          value={stats.active}
          icon={UserCheck}
          color="text-green-600"
          bgColor="bg-green-500"
          index={1}
        />
        <StatCard
          title="Inactive Students"
          value={stats.inactive}
          icon={UserX}
          color="text-orange-600"
          bgColor="bg-orange-500"
          index={2}
        />
        <StatCard
          title="Avg Progress"
          value={stats.avgProgress}
          icon={TrendingUp}
          color="text-purple-600"
          bgColor="bg-purple-500"
          index={3}
        />
      </div>

      {/* Search and Filter */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '400ms' }}>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" size={20} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-all duration-300 hover:border-amber-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-400 font-semibold hover:border-amber-300 transition-all duration-300 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button className="border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-300 transition-all duration-300 flex items-center font-semibold hover:scale-105">
              <Filter size={20} className="mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => {
          const isHovered = hoveredCard === student.id;
          
          return (
            <div
              key={student.id}
              className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${500 + index * 100}ms`,
                animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none'
              }}
              onMouseEnter={() => setHoveredCard(student.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <div className="relative">
                {/* Header with Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`relative ${isHovered ? 'scale-110 rotate-6' : ''} transition-all duration-300`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">{student.avatar}</span>
                      </div>
                      {/* Status indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        student.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      } ${student.status === 'active' ? 'animate-pulse' : ''}`}></div>
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold text-gray-900 transition-colors duration-300 ${
                        isHovered ? 'text-amber-600' : ''
                      }`}>{student.name}</h3>
                      <div className="mt-1">
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 hover:text-amber-600 transition-colors">
                    <Mail size={14} className="mr-2 text-amber-500" />
                    {student.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 hover:text-amber-600 transition-colors">
                    <Phone size={14} className="mr-2 text-amber-500" />
                    {student.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-2 text-amber-500" />
                    Last active: {student.lastActive}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <BookOpen size={18} className="text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">{student.enrolledCourses}</span>
                    </div>
                    <p className="text-xs text-blue-700 font-semibold mt-1">Enrolled</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <Award size={18} className="text-green-600" />
                      <span className="text-2xl font-bold text-green-600">{student.completedCourses}</span>
                    </div>
                    <p className="text-xs text-green-700 font-semibold mt-1">Completed</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 flex items-center">
                      <Target size={14} className="mr-1 text-amber-500" />
                      Overall Progress
                    </span>
                    <span className="text-sm font-bold text-amber-600">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="h-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 rounded-full transition-all duration-1000 animate-shimmer relative"
                      style={{ 
                        width: `${student.progress}%`,
                        backgroundSize: '200% 100%'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{student.completedLessons} / {student.totalLessons} lessons</span>
                    <span className="flex items-center">
                      <Star size={12} className="mr-1 text-yellow-500 fill-current" />
                      {student.rating}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    Joined {new Date(student.joinedDate).toLocaleDateString()}
                  </div>
                  <button className="text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-amber-400/50 flex items-center text-sm font-semibold">
                    <Eye size={14} className="mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center animate-fadeIn">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <Users size={64} className="relative mx-auto text-amber-500 mb-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500 text-lg">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No students enrolled yet'
            }
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentsPage;
