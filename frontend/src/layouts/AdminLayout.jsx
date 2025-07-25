import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Users,
  BarChart3,
  Bell,
  UserCircle,
  Menu,
  X,
  Home,
  BookOpen,
  Calendar,
  Activity,
  PieChart,
  MessageSquare,
  Gift,
  FileText,
  LogOut
} from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../components/NotificationBell';
import ChildAvatar from '../components/ChildAvatar';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
  const { t } = useTranslation('parent');
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [avatarName, setAvatarName] = useState('Admin');

  // Check if mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Set avatar name
  useEffect(() => {
    setAvatarName(user?.username || 'Admin');
  }, [user]);

  const navigationItems = [
    {
      href: '/admin',
      icon: Home,
      label: t('navigation.dashboard'),
      description: t('navigation.dashboard_description')
    },
    {
      href: '/admin/children',
      icon: Users,
      label: t('navigation.children'),
      description: t('navigation.children_description')
    },
    {
      label: t('navigation.content_management'),
      isSection: true,
      items: [
        {
          href: '/admin/content/education',
          icon: BookOpen,
          label: t('navigation.education'),
          description: t('navigation.education_description')
        },
        {
          href: '/admin/content/habits',
          icon: Calendar,
          label: t('navigation.habits'),
          description: t('navigation.habits_description')
        },
        {
          href: '/admin/content/rewards',
          icon: Gift,
          label: t('navigation.rewards'),
          description: t('navigation.rewards_description')
        }
      ]
    },
    {
      href: '/admin/assignments',
      icon: FileText,
      label: t('navigation.assignments'),
      description: t('navigation.assignments_description')
    },
    {
      href: '/admin/activity-logs',
      icon: Activity,
      label: t('navigation.activity_logs'),
      description: t('navigation.activity_logs_description')
    },
    {
      href: '/admin/analytics',
      icon: PieChart,
      label: t('navigation.analytics'),
      description: t('navigation.analytics_description')
    },
    {
      href: '/admin/chat',
      icon: MessageSquare,
      label: t('navigation.chat'),
      description: t('navigation.chat_description')
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: t('navigation.settings'),
      description: t('navigation.settings_description')
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  const renderNavigationItem = (item, index) => {
    if (item.isSection) {
      return (
        <div key={index} className="py-4">
          <h3 className="px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            {item.label}
          </h3>
          <div className="space-y-1">
            {item.items.map((subItem, subIndex) => renderNavigationItem(subItem, `${index}-${subIndex}`))}
          </div>
        </div>
      );
    }

    const isActive = location.pathname === item.href ||
      (item.href !== '/admin' && location.pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
      <motion.a
        key={index}
        href={item.href}
        className={`
          group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200
          ${isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'hover:bg-surface-hover text-text-primary hover:text-primary'
          }
        `}
        whileHover={{ x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-text-secondary group-hover:text-primary'}`} />
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm ${isActive ? 'text-primary-foreground' : ''}`}>
            {item.label}
          </div>
          {item.description && (
            <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-foreground/80' : 'text-text-secondary'}`}>
              {item.description}
            </div>
          )}
        </div>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="w-1 h-6 bg-primary-foreground rounded-full"
            initial={false}
          />
        )}
      </motion.a>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side: Logo and menu toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
              aria-label={sidebarOpen ? t('common.close_menu') : t('common.open_menu')}
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-text-primary">Learning Companion</h1>
                <p className="text-xs text-text-secondary">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell count={notificationCount} />
            <ChildAvatar name={avatarName} />
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle userType="parent" />
            </div>

            {/* Mobile settings menu */}
            <div className="sm:hidden">
              <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <UserCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <motion.aside
              initial={isMobile ? "closed" : "open"}
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className={`
                ${isMobile ? 'fixed' : 'sticky'} top-16 left-0 z-40
                w-80 h-[calc(100vh-4rem)] bg-surface border-r border-border
                overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent
              `}
            >
              <nav className="p-4 space-y-2">
                {navigationItems.map((item, index) => renderNavigationItem(item, index))}

                {/* Logout Button */}
                <div className="pt-4 border-t border-border">
                  <motion.button
                    onClick={logout}
                    className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 w-full text-left hover:bg-red-500/10 text-text-primary hover:text-red-500"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0 text-text-secondary group-hover:text-red-500" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {t('common.logout')}
                      </div>
                      <div className="text-xs mt-0.5 text-text-secondary">
                        {t('common.sign_out')}
                      </div>
                    </div>
                  </motion.button>
                </div>
              </nav>

              {/* Mobile settings at bottom */}
              {isMobile && (
                <div className="p-4 border-t border-border bg-surface/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{t('navigation.settings')}</span>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <LanguageToggle userType="parent" />
                    </div>
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={`
          flex-1 transition-all duration-300
          ${!isMobile ? 'lg:ml-0' : ''}
        `}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
