import React, { useState, useRef } from 'react';
import { Send, Mail, Users, FileText, Upload, Trash2, Plus, Edit3, CheckCircle, XCircle, BarChart3, Pause, Play, Search, PenTool, Eye, Code, X, TestTube, Wifi, WifiOff, RefreshCw, Save, Server, Shuffle, Check, Circle, RotateCcw, ChevronDown, ChevronRight, Download, Copy, Clock, Zap, AlertCircle, Info, Settings, HelpCircle, Moon, Sun, Smartphone, Laptop, Sparkles, SortAsc } from 'lucide-react';

const themes = {
  dark: {
    name: 'Midnight Pro',
    bg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    card: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#e2e8f0',
    textMuted: '#64748b',
    accent: '#818cf8',
    accentGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
    input: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.1)',
    shadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  light: {
    name: 'Clean Light',
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    card: 'rgba(255,255,255,0.9)',
    cardBorder: 'rgba(0,0,0,0.06)',
    text: '#1e293b',
    textMuted: '#64748b',
    accent: '#6366f1',
    accentGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    input: '#fff',
    inputBorder: '#e2e8f0',
    shadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  cyber: {
    name: 'Cyber Neon',
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #0f1419 50%, #1a1f2e 100%)',
    card: 'rgba(0,255,136,0.03)',
    cardBorder: 'rgba(0,255,136,0.15)',
    text: '#00ff88',
    textMuted: '#00aa55',
    accent: '#00ff88',
    accentGradient: 'linear-gradient(135deg, #00ff88, #00ccff)',
    success: '#00ff88',
    danger: '#ff0055',
    warning: '#ffcc00',
    input: 'rgba(0,255,136,0.05)',
    inputBorder: 'rgba(0,255,136,0.2)',
    shadow: '0 0 40px rgba(0,255,136,0.1)',
  }
};

export default function EmailSenderUltimate() {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themes[currentTheme];
  
  const [activeTab, setActiveTab] = useState('compose');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome Email', subject: 'Welcome to {{company}}!', body: '<h2 style="color:#667eea;">Welcome {{name}}!</h2><p>We\'re thrilled to have you on board.</p><p>Best regards,<br/>{{sender}}</p>', selected: false, tags: ['onboarding'] },
    { id: 2, name: 'Follow Up', subject: 'Following up on our conversation', body: '<p>Hi {{name}},</p><p>Just wanted to check in and see how things are going.</p><p>Best,<br/>{{sender}}</p>', selected: false, tags: ['sales'] },
    { id: 3, name: 'Newsletter', subject: '{{company}} Monthly Newsletter', body: '<h1 style="text-align:center;">📬 Newsletter</h1><p>Hi {{name}},</p><p>Here are this month\'s highlights...</p>', selected: false, tags: ['marketing'] },
    { id: 4, name: 'Promo Offer', subject: '🎉 Special Offer Just for You!', body: '<div style="text-align:center;padding:20px;"><h1>🎉 20% OFF</h1><p>Hi {{name}}, we have an exclusive offer for you!</p><p>Use code: <strong>SAVE20</strong></p></div>', selected: false, tags: ['promo'] },
    { id: 5, name: 'Thank You', subject: 'Thank you, {{name}}!', body: '<p>Dear {{name}},</p><p>Thank you for your continued support of {{company}}.</p><p>Warm regards,<br/>{{sender}}</p>', selected: false, tags: ['appreciation'] }
  ]);
  
  const [smtpAccounts, setSmtpAccounts] = useState([
    { id: 1, name: 'Office 365 Primary', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', status: 'untested', enabled: true, dailyLimit: 10000, encryption: 'STARTTLS' }
  ]);
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [showSmtpImportModal, setShowSmtpImportModal] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(null);
  const [newSmtp, setNewSmtp] = useState({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, dailyLimit: 10000, encryption: 'STARTTLS' });
  const [smtpImportText, setSmtpImportText] = useState('');
  const [testingSmtpId, setTestingSmtpId] = useState(null);
  
  const [messageRotation, setMessageRotation] = useState(false);
  const [rotationType, setRotationType] = useState('sequential');
  const [smtpRotation, setSmtpRotation] = useState(false);
  const [smtpRotationType, setSmtpRotationType] = useState('sequential');
  
  const [emailData, setEmailData] = useState({ subject: '', body: '', cc: '', bcc: '', replyTo: '' });
  const [editorMode, setEditorMode] = useState('visual');
  
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewContact, setPreviewContact] = useState(null);
  
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [campaignPaused, setCampaignPaused] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [currentlySending, setCurrentlySending] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [currentSmtp, setCurrentSmtp] = useState('');
  const [sendingStats, setSendingStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [sendDelay, setSendDelay] = useState(1);
  const [batchSize, setBatchSize] = useState(50);
  const [scheduledTime, setScheduledTime] = useState('');
  
  const [importText, setImportText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('email');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '', tags: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showContactImportHelp, setShowContactImportHelp] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const fileInputRef = useRef(null);
  const smtpFileInputRef = useRef(null);

  const groups = ['All', 'Customers', 'Leads', 'Partners', 'VIP', 'Newsletter'];
  const mergeFields = ['{{name}}', '{{email}}', '{{company}}', '{{sender}}', '{{date}}', '{{unsubscribe}}'];
  const selectedTemplates = templates.filter(t => t.selected);
  const enabledSmtp = smtpAccounts.filter(s => s.enabled);
  const selectedCount = contacts.filter(c => c.selected).length;
  
  const filteredContacts = contacts
    .filter(c => (selectedGroup === 'All' || c.group === selectedGroup) && 
      (c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
       c.name.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const replaceMergeFields = (text, contact) => {
    if (!text || !contact) return text;
    return text
      .replace(/{{name}}/gi, contact.name || '')
      .replace(/{{email}}/gi, contact.email || '')
      .replace(/{{company}}/gi, contact.company || '')
      .replace(/{{sender}}/gi, smtpAccounts[0]?.fromName || 'Your Team')
      .replace(/{{date}}/gi, new Date().toLocaleDateString())
      .replace(/{{unsubscribe}}/gi, '<a href="#">Unsubscribe</a>');
  };

  const handleImportContacts = () => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = importText.match(regex) || [];
    const unique = [...new Set(matches.map(e => e.toLowerCase()))];
    
    if (unique.length === 0) {
      addNotification('No valid emails found', 'warning');
      return;
    }
    
    const newContacts = unique.map((email, i) => ({
      id: Date.now() + i,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      company: email.split('@')[1].split('.')[0].toUpperCase(),
      group: selectedGroup === 'All' ? 'Customers' : selectedGroup,
      status: 'ready',
      selected: true,
      tags: []
    }));
    
    setContacts(prev => {
      const existing = new Set(prev.map(c => c.email));
      const added = newContacts.filter(c => !existing.has(c.email));
      if (added.length < newContacts.length) {
        addNotification(`${newContacts.length - added.length} duplicates skipped`, 'warning');
      }
      addNotification(`${added.length} contacts imported`, 'success');
      return [...prev, ...added];
    });
    setImportText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImportText(ev.target.result);
      reader.readAsText(file);
    }
  };

  const handleSmtpImport = () => {
    const lines = smtpImportText.trim().split('\n').filter(l => l.trim());
    let imported = 0, failed = 0;
    
    lines.forEach((line, index) => {
      try {
        let parts;
        if (line.includes('|')) parts = line.split('|').map(p => p.trim());
        else if (line.includes(',')) parts = line.split(',').map(p => p.trim());
        else if (line.includes('\t')) parts = line.split('\t').map(p => p.trim());
        else { failed++; return; }
        
        if (parts.length >= 4) {
          const [host, port, username, password, fromName = '', fromEmail = '', name = ''] = parts;
          setSmtpAccounts(prev => [...prev, {
            id: Date.now() + index,
            name: name || `SMTP ${prev.length + 1}`,
            host, port: port || '587', username, password,
            fromName: fromName || username.split('@')[0],
            fromEmail: fromEmail || username,
            status: 'untested', enabled: true, dailyLimit: 10000, encryption: 'STARTTLS'
          }]);
          imported++;
        } else { failed++; }
      } catch { failed++; }
    });
    
    if (imported > 0) addNotification(`${imported} SMTP accounts imported`, 'success');
    if (failed > 0) addNotification(`${failed} lines failed`, 'warning');
    setSmtpImportText('');
    setShowSmtpImportModal(false);
  };

  const handleSmtpFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSmtpImportText(ev.target.result);
      reader.readAsText(file);
    }
  };

  const addSmtpAccount = () => {
    if (!newSmtp.name || !newSmtp.host) {
      addNotification('Enter name and host', 'warning');
      return;
    }
    if (editingSmtp) {
      setSmtpAccounts(prev => prev.map(s => s.id === editingSmtp.id ? { ...newSmtp, id: s.id, status: 'untested' } : s));
      addNotification('SMTP updated', 'success');
    } else {
      setSmtpAccounts(prev => [...prev, { ...newSmtp, id: Date.now(), status: 'untested' }]);
      addNotification('SMTP added', 'success');
    }
    setNewSmtp({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, dailyLimit: 10000, encryption: 'STARTTLS' });
    setEditingSmtp(null);
    setShowSmtpModal(false);
  };

  const testSmtp = async (id) => {
    setTestingSmtpId(id);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    const smtp = smtpAccounts.find(s => s.id === id);
    const success = smtp.username && smtp.password && smtp.host;
    setSmtpAccounts(prev => prev.map(s => s.id === id ? { ...s, status: success ? 'success' : 'failed' } : s));
    addNotification(success ? `${smtp.name} connected` : `${smtp.name} failed`, success ? 'success' : 'danger');
    setTestingSmtpId(null);
  };

  const testAllSmtp = async () => { for (const s of smtpAccounts) await testSmtp(s.id); };
  const toggleTemplate = (id) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));

  const saveTemplate = () => {
    if (!newTemplate.name) { addNotification('Enter template name', 'warning'); return; }
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...newTemplate, id: t.id, selected: t.selected } : t));
      addNotification('Template updated', 'success');
    } else {
      setTemplates(prev => [...prev, { ...newTemplate, id: Date.now(), selected: false }]);
      addNotification('Template saved', 'success');
    }
    setNewTemplate({ name: '', subject: '', body: '', tags: [] });
    setEditingTemplate(null);
    setShowTemplateModal(false);
  };

  const getTemplate = (i) => {
    if (!messageRotation || !selectedTemplates.length) return { subject: emailData.subject, body: emailData.body, name: 'Custom' };
    if (rotationType === 'random') return selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
    return selectedTemplates[i % selectedTemplates.length];
  };

  const getSmtp = (i) => {
    if (!enabledSmtp.length) return null;
    if (!smtpRotation) return enabledSmtp[0];
    if (smtpRotationType === 'random') return enabledSmtp[Math.floor(Math.random() * enabledSmtp.length)];
    return enabledSmtp[i % enabledSmtp.length];
  };

  const startCampaign = async () => {
    const selected = contacts.filter(c => c.selected);
    if (!selected.length) { addNotification('Select contacts', 'warning'); return; }
    if (!messageRotation && (!emailData.subject || !emailData.body)) { addNotification('Enter subject & body', 'warning'); return; }
    if (messageRotation && !selectedTemplates.length) { addNotification('Select templates', 'warning'); return; }
    if (!enabledSmtp.length) { addNotification('Enable SMTP', 'warning'); return; }
    
    setSendingCampaign(true);
    setCampaignPaused(false);
    setCampaignProgress(0);
    setSendingStats({ sent: 0, failed: 0, total: selected.length });
    
    const campaign = {
      id: Date.now(),
      name: messageRotation ? `Rotation (${selectedTemplates.length} templates)` : emailData.subject.slice(0, 40),
      date: new Date().toLocaleString(),
      total: selected.length, sent: 0, failed: 0, status: 'sending'
    };
    setCampaigns(prev => [campaign, ...prev]);
    addNotification(`Campaign started: ${selected.length} contacts`, 'info');
    
    for (let i = 0; i < selected.length; i++) {
      while (campaignPaused) await new Promise(r => setTimeout(r, 100));
      const contact = selected[i];
      const tpl = getTemplate(i);
      const smtp = getSmtp(i);
      setCurrentlySending(contact.email);
      setCurrentTemplate(tpl.name);
      setCurrentSmtp(smtp?.name || 'Default');
      await new Promise(r => setTimeout(r, sendDelay * 1000));
      const success = Math.random() > 0.05;
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: success ? 'sent' : 'failed' } : c));
      setSendingStats(prev => ({ ...prev, sent: success ? prev.sent + 1 : prev.sent, failed: success ? prev.failed : prev.failed + 1 }));
      setCampaignProgress(Math.round(((i + 1) / selected.length) * 100));
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, sent: success ? c.sent + 1 : c.sent, failed: success ? c.failed : c.failed + 1 } : c));
    }
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'completed' } : c));
    setSendingCampaign(false);
    addNotification(`Campaign completed`, 'success');
  };

  const exportData = (type) => {
    let data, filename;
    switch(type) {
      case 'contacts':
        data = contacts.map(c => `${c.email},${c.name},${c.company},${c.group}`).join('\n');
        filename = 'contacts.csv';
        break;
      case 'templates':
        data = JSON.stringify(templates, null, 2);
        filename = 'templates.json';
        break;
      case 'smtp':
        data = smtpAccounts.map(s => `${s.host}|${s.port}|${s.username}|${s.password}|${s.fromName}|${s.fromEmail}|${s.name}`).join('\n');
        filename = 'smtp_accounts.txt';
        break;
      case 'campaigns':
        data = JSON.stringify(campaigns, null, 2);
        filename = 'campaigns.json';
        break;
      default: return;
    }
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    addNotification(`${type} exported`, 'success');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addNotification('Copied to clipboard', 'success');
  };

  const s = {
    container: { minHeight: '100vh', background: theme.bg, padding: '24px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: theme.text, transition: 'all 0.3s ease' },
    card: { background: theme.card, borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${theme.cardBorder}`, boxShadow: theme.shadow, backdropFilter: 'blur(12px)' },
    input: { width: '100%', padding: '12px 16px', background: theme.input, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', fontSize: '14px', color: theme.text, marginBottom: '12px', boxSizing: 'border-box', outline: 'none' },
    textarea: { width: '100%', minHeight: '200px', padding: '16px', background: theme.input, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', fontSize: '14px', fontFamily: 'monospace', color: theme.text, resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
    btnPrimary: { background: theme.accentGradient, color: '#fff' },
    btnSuccess: { background: `linear-gradient(135deg, ${theme.success}, ${theme.success}dd)`, color: '#fff' },
    btnDanger: { background: `linear-gradient(135deg, ${theme.danger}, ${theme.danger}dd)`, color: '#fff' },
    btnWarning: { background: `linear-gradient(135deg, ${theme.warning}, ${theme.warning}dd)`, color: '#000' },
    btnSecondary: { background: theme.input, color: theme.text, border: `2px solid ${theme.inputBorder}` },
    btnSmall: { padding: '6px 12px', fontSize: '12px' },
    btnIcon: { padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: theme.textMuted, cursor: 'pointer' },
    tab: { padding: '12px 20px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { background: theme.accentGradient, color: '#fff' },
    tabInactive: { background: theme.card, color: theme.textMuted, border: `1px solid ${theme.cardBorder}` },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
    modalContent: { background: currentTheme === 'dark' ? '#1a1a2e' : currentTheme === 'cyber' ? '#0f1419' : '#fff', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${theme.cardBorder}` },
    previewFrame: { background: '#fff', borderRadius: '8px', padding: '20px', color: '#333', minHeight: '300px' },
    notification: { position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' },
    notificationItem: { padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideIn 0.3s ease' },
    rotationBox: { background: currentTheme === 'cyber' ? 'rgba(255,204,0,0.1)' : 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.1))', borderRadius: '12px', padding: '20px', border: `2px solid ${theme.warning}40`, marginBottom: '20px' },
    smtpBox: { background: currentTheme === 'cyber' ? 'rgba(0,204,255,0.1)' : 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', borderRadius: '12px', padding: '20px', border: `2px solid ${theme.accent}40`, marginBottom: '20px' },
    statBox: { textAlign: 'center', padding: '16px', background: theme.card, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` },
    codeBlock: { background: currentTheme === 'light' ? '#f1f5f9' : '#0f0f1a', padding: '16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', color: theme.text, overflowX: 'auto', whiteSpace: 'pre-wrap' }
  };

  const getNotificationBg = (type) => {
    switch(type) {
      case 'success': return theme.success;
      case 'danger': return theme.danger;
      case 'warning': return theme.warning;
      default: return theme.accent;
    }
  };

  return (
    <div style={s.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
        ::placeholder { color: ${theme.textMuted}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${theme.input}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: ${theme.accent}40; border-radius: 4px; }
        input:focus, textarea:focus, select:focus { border-color: ${theme.accent} !important; }
        button:hover { transform: translateY(-1px); filter: brightness(1.1); }
        button:active { transform: translateY(0); }
      `}</style>

      {/* Notifications */}
      <div style={s.notification}>
        {notifications.map(n => (
          <div key={n.id} style={{ ...s.notificationItem, background: getNotificationBg(n.type), color: n.type === 'warning' ? '#000' : '#fff' }}>
            {n.type === 'success' && <CheckCircle size={18} />}
            {n.type === 'danger' && <XCircle size={18} />}
            {n.type === 'warning' && <AlertCircle size={18} />}
            {n.type === 'info' && <Info size={18} />}
            {n.message}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ ...s.card, background: theme.accentGradient, border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '14px' }}><Send color="#fff" size={32} /></div>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#fff', fontWeight: '700' }}>Email Sender Ultimate</h1>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Advanced Multi-SMTP & Message Rotation Engine</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                {[{ l: 'Contacts', v: contacts.length, c: '#60a5fa' }, { l: 'Selected', v: selectedCount, c: '#34d399' }, { l: 'SMTP', v: enabledSmtp.length, c: '#fbbf24' }, { l: 'Templates', v: templates.length, c: '#a78bfa' }].map(x => (
                  <div key={x.l} style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>{x.l}</div><div style={{ fontSize: '26px', fontWeight: '700', color: '#fff' }}>{x.v}</div></div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '10px' }}>
                {Object.keys(themes).map(t => (
                  <button key={t} onClick={() => setCurrentTheme(t)} style={{ ...s.btn, ...s.btnSmall, background: currentTheme === t ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff', padding: '6px 10px' }}>
                    {t === 'dark' && <Moon size={14} />}{t === 'light' && <Sun size={14} />}{t === 'cyber' && <Zap size={14} />}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowHelpModal(true)} style={{ ...s.btnIcon, color: '#fff' }}><HelpCircle size={22} /></button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[{ id: 'compose', icon: PenTool, l: 'Compose' }, { id: 'contacts', icon: Users, l: 'Contacts' }, { id: 'templates', icon: FileText, l: 'Templates' }, { id: 'smtp', icon: Server, l: 'SMTP' }, { id: 'campaigns', icon: BarChart3, l: 'Campaigns' }, { id: 'settings', icon: Settings, l: 'Settings' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : s.tabInactive) }}><t.icon size={18} /> {t.l}</button>
          ))}
        </div>

        {/* COMPOSE TAB */}
        {activeTab === 'compose' && (
          <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 500px' : '1fr 340px', gap: '24px' }}>
            <div>
              <div style={s.card}>
                {/* Message Rotation */}
                <div style={s.rotationBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: messageRotation ? '16px' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Shuffle size={24} color={theme.warning} /><div><h3 style={{ margin: 0, color: theme.warning, fontSize: '16px', fontWeight: '600' }}>Message Rotation</h3><p style={{ margin: 0, fontSize: '12px', color: theme.textMuted }}>Rotate templates to avoid spam filters</p></div></div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={messageRotation} onChange={e => setMessageRotation(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: theme.warning }} /><span style={{ fontWeight: '700', color: theme.warning }}>{messageRotation ? 'ON' : 'OFF'}</span></label>
                  </div>
                  {messageRotation && (
                    <div>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: theme.text, cursor: 'pointer' }}><input type="radio" checked={rotationType === 'sequential'} onChange={() => setRotationType('sequential')} /> Sequential (1→2→3→1...)</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: theme.text, cursor: 'pointer' }}><input type="radio" checked={rotationType === 'random'} onChange={() => setRotationType('random')} /> Random</label>
                      </div>
                      <div style={{ background: theme.input, borderRadius: '10px', padding: '16px', border: `1px solid ${theme.inputBorder}` }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: theme.text }}>Select templates ({selectedTemplates.length} selected):</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {templates.map(t => (<button key={t.id} onClick={() => toggleTemplate(t.id)} style={{ ...s.btn, ...s.btnSmall, ...(t.selected ? s.btnSuccess : s.btnSecondary) }}>{t.selected ? <Check size={14} /> : <Circle size={14} />} {t.name}</button>))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SMTP Rotation */}
                <div style={s.smtpBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: smtpRotation ? '16px' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Server size={24} color={theme.accent} /><div><h3 style={{ margin: 0, color: theme.accent, fontSize: '16px', fontWeight: '600' }}>SMTP Rotation</h3><p style={{ margin: 0, fontSize: '12px', color: theme.textMuted }}>Distribute load across servers</p></div></div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={smtpRotation} onChange={e => setSmtpRotation(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: theme.accent }} /><span style={{ fontWeight: '700', color: theme.accent }}>{smtpRotation ? 'ON' : 'OFF'}</span></label>
                  </div>
                  {smtpRotation && (
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: theme.text, cursor: 'pointer' }}><input type="radio" checked={smtpRotationType === 'sequential'} onChange={() => setSmtpRotationType('sequential')} /> Sequential</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: theme.text, cursor: 'pointer' }}><input type="radio" checked={smtpRotationType === 'random'} onChange={() => setSmtpRotationType('random')} /> Random</label>
                    </div>
                  )}
                </div>

                {!messageRotation && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>TO: ({selectedCount} recipients)</label>
                      <div style={{ ...s.input, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '48px', marginBottom: 0, cursor: 'pointer' }} onClick={() => setActiveTab('contacts')}>
                        {contacts.filter(c => c.selected).slice(0, 5).map(c => (<span key={c.id} style={{ background: theme.accent, color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{c.email}</span>))}
                        {selectedCount > 5 && <span style={{ color: theme.textMuted, fontSize: '12px' }}>+{selectedCount - 5} more</span>}
                        {!selectedCount && <span style={{ color: theme.textMuted }}>Click to select contacts...</span>}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>CC:</label><input style={{ ...s.input, marginBottom: 0, marginTop: '6px' }} placeholder="cc@example.com" value={emailData.cc} onChange={e => setEmailData(p => ({ ...p, cc: e.target.value }))} /></div>
                      <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>BCC:</label><input style={{ ...s.input, marginBottom: 0, marginTop: '6px' }} placeholder="bcc@example.com" value={emailData.bcc} onChange={e => setEmailData(p => ({ ...p, bcc: e.target.value }))} /></div>
                      <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Reply-To:</label><input style={{ ...s.input, marginBottom: 0, marginTop: '6px' }} placeholder="reply@example.com" value={emailData.replyTo} onChange={e => setEmailData(p => ({ ...p, replyTo: e.target.value }))} /></div>
                    </div>
                    <div style={{ marginBottom: '16px' }}><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Subject:</label><input style={{ ...s.input, marginTop: '6px' }} placeholder="Email subject line..." value={emailData.subject} onChange={e => setEmailData(p => ({ ...p, subject: e.target.value }))} /></div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      {['visual', 'html'].map(m => (<button key={m} onClick={() => setEditorMode(m)} style={{ ...s.btn, ...s.btnSmall, ...(editorMode === m ? s.btnPrimary : s.btnSecondary) }}>{m === 'visual' ? <Eye size={14} /> : <Code size={14} />} {m.toUpperCase()}</button>))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: theme.textMuted, marginRight: '4px' }}>Insert merge field:</span>
                      {mergeFields.map(f => (<button key={f} onClick={() => setEmailData(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 10px', fontSize: '11px' }}>{f}</button>))}
                    </div>
                    <textarea style={s.textarea} placeholder={editorMode === 'html' ? '<p>Write your HTML email here...</p>' : 'Write your email message here...'} value={emailData.body} onChange={e => setEmailData(p => ({ ...p, body: e.target.value }))} />
                  </>
                )}

                {messageRotation && (
                  <div style={{ background: `${theme.success}15`, borderRadius: '12px', padding: '20px', border: `2px solid ${theme.success}40` }}>
                    <h3 style={{ margin: '0 0 8px', color: theme.success, display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20} /> Rotation Mode Active</h3>
                    <p style={{ margin: 0, color: theme.text, fontSize: '14px' }}>{selectedTemplates.length} templates selected ({rotationType} order){smtpRotation && <><br/>{enabledSmtp.length} SMTP accounts in rotation</>}</p>
                  </div>
                )}

                {/* Advanced Options */}
                <div style={{ marginTop: '20px', borderTop: `1px solid ${theme.cardBorder}`, paddingTop: '20px' }}>
                  <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: theme.textMuted, padding: 0 }}>
                    {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Advanced Options
                  </button>
                  {showAdvanced && (
                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Delay (sec):</label><input type="number" min="0" max="60" style={{ ...s.input, marginBottom: 0 }} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} /></div>
                      <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Batch size:</label><input type="number" min="1" max="1000" style={{ ...s.input, marginBottom: 0 }} value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} /></div>
                      <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Schedule:</label><input type="datetime-local" style={{ ...s.input, marginBottom: 0 }} value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} /></div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={startCampaign} disabled={sendingCampaign || !selectedCount} style={{ ...s.btn, ...s.btnSuccess, flex: 1, justifyContent: 'center', opacity: (sendingCampaign || !selectedCount) ? 0.5 : 1, cursor: (sendingCampaign || !selectedCount) ? 'not-allowed' : 'pointer' }}><Send size={18} /> {sendingCampaign ? 'Sending...' : `Send to ${selectedCount} Contacts`}</button>
                  <button onClick={() => setShowPreview(!showPreview)} style={{ ...s.btn, ...s.btnPrimary }}><Eye size={18} /> Preview</button>
                  <button onClick={() => { setNewTemplate({ name: '', subject: emailData.subject, body: emailData.body, tags: [] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}><Save size={18} /></button>
                </div>

                {/* Progress */}
                {sendingCampaign && (
                  <div style={{ marginTop: '24px', background: `${theme.success}10`, borderRadius: '12px', padding: '20px', border: `2px solid ${theme.success}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '600', color: theme.success, display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={16} style={{ animation: 'pulse 1s infinite' }} /> Sending Campaign...</span>
                      <button onClick={() => setCampaignPaused(!campaignPaused)} style={{ ...s.btn, ...s.btnSmall, background: campaignPaused ? theme.success : theme.warning, color: campaignPaused ? '#fff' : '#000' }}>{campaignPaused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ flex: 1, height: '10px', background: `${theme.success}30`, borderRadius: '10px', overflow: 'hidden' }}><div style={{ width: `${campaignProgress}%`, height: '100%', background: theme.success, transition: 'width 0.3s ease', borderRadius: '10px' }} /></div>
                      <span style={{ fontWeight: '700', color: theme.success, minWidth: '50px' }}>{campaignProgress}%</span>
                    </div>
                    <div style={{ fontSize: '13px', color: theme.text }}><div><strong>Current:</strong> {currentlySending}</div>{messageRotation && <div><strong>Template:</strong> {currentTemplate}</div>}{smtpRotation && <div><strong>SMTP:</strong> {currentSmtp}</div>}</div>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '12px', fontSize: '14px' }}>
                      <span style={{ color: theme.success, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={16} /> Sent: {sendingStats.sent}</span>
                      <span style={{ color: theme.danger, display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={16} /> Failed: {sendingStats.failed}</span>
                      <span style={{ color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> Remaining: {sendingStats.total - sendingStats.sent - sendingStats.failed}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Right Sidebar */}
            <div>
              {showPreview ? (
                <div style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.text }}>Email Preview</h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setPreviewDevice('mobile')} style={{ ...s.btnIcon, color: previewDevice === 'mobile' ? theme.accent : theme.textMuted }}><Smartphone size={18} /></button>
                      <button onClick={() => setPreviewDevice('desktop')} style={{ ...s.btnIcon, color: previewDevice === 'desktop' ? theme.accent : theme.textMuted }}><Laptop size={18} /></button>
                      <button onClick={() => setShowPreview(false)} style={s.btnIcon}><X size={18} /></button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '12px', color: theme.textMuted, display: 'block', marginBottom: '6px' }}>Preview as:</label>
                    <select style={{ ...s.input, marginBottom: 0 }} value={previewContact?.id || ''} onChange={e => { const c = contacts.find(c => c.id === Number(e.target.value)); setPreviewContact(c || { name: 'John Doe', email: 'john@example.com', company: 'ACME Corp' }); }}>
                      <option value="">Sample Contact</option>
                      {contacts.slice(0, 20).map(c => (<option key={c.id} value={c.id}>{c.name} ({c.email})</option>))}
                    </select>
                  </div>
                  <div style={{ ...s.previewFrame, maxWidth: previewDevice === 'mobile' ? '375px' : '100%', margin: '0 auto', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}><strong>From:</strong> {smtpAccounts[0]?.fromName || 'Sender'} &lt;{smtpAccounts[0]?.fromEmail || 'sender@email.com'}&gt;</div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}><strong>To:</strong> {previewContact?.email || 'recipient@email.com'}</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{replaceMergeFields(messageRotation && selectedTemplates.length ? selectedTemplates[0].subject : emailData.subject, previewContact || { name: 'John Doe', email: 'john@example.com', company: 'ACME Corp' }) || 'No subject'}</div>
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }} dangerouslySetInnerHTML={{ __html: replaceMergeFields(messageRotation && selectedTemplates.length ? selectedTemplates[0].body : emailData.body, previewContact || { name: 'John Doe', email: 'john@example.com', company: 'ACME Corp' }) || '<p style="color:#999;">Email body will appear here...</p>' }} />
                  </div>
                </div>
              ) : (
                <>
                  <div style={s.card}><h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: theme.text }}>Quick Templates</h3>{templates.slice(0, 5).map(t => (<button key={t.id} onClick={() => setEmailData(p => ({ ...p, subject: t.subject, body: t.body }))} style={{ ...s.btn, ...s.btnSecondary, justifyContent: 'flex-start', width: '100%', marginBottom: '8px' }}><FileText size={14} /> {t.name}</button>))}</div>
                  <div style={{ ...s.card, background: theme.accentGradient }}><h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={20} /> Pro Tips</h3><ul style={{ fontSize: '13px', lineHeight: '1.8', paddingLeft: '16px', margin: 0, color: 'rgba(255,255,255,0.9)' }}><li>Enable message rotation to improve deliverability</li><li>Use multiple SMTP accounts to distribute load</li><li>Add delays between emails to avoid rate limits</li><li>Personalize with merge fields like {"{{name}}"}</li><li>Test your SMTP before sending campaigns</li></ul></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: theme.text }}>Contact Management</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: true })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><CheckCircle size={14} /> Select All</button>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: false })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}><Circle size={14} /> Deselect</button>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, status: 'ready' })))} style={{ ...s.btn, ...s.btnWarning, ...s.btnSmall }}><RotateCcw size={14} /> Reset</button>
                <button onClick={() => exportData('contacts')} style={{ ...s.btn, ...s.btnPrimary, ...s.btnSmall }}><Download size={14} /> Export</button>
                <button onClick={() => setContacts([])} style={{ ...s.btn, ...s.btnDanger, ...s.btnSmall }}><Trash2 size={14} /> Clear</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
              <div>
                <div style={{ background: theme.input, borderRadius: '12px', padding: '20px', marginBottom: '16px', border: `1px solid ${theme.inputBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}><h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0, color: theme.text }}>Import Contacts</h3><button onClick={() => setShowContactImportHelp(true)} style={s.btnIcon}><HelpCircle size={16} /></button></div>
                  <textarea style={{ ...s.textarea, minHeight: '120px' }} placeholder="Paste emails here (any format)...&#10;&#10;Examples:&#10;john@example.com&#10;Jane Doe <jane@company.com>&#10;mike@test.org, sarah@demo.com" value={importText} onChange={e => setImportText(e.target.value)} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={handleImportContacts} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={16} /> Import</button>
                    <label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={16} /><input ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleFileUpload} /></label>
                  </div>
                </div>
                <div style={{ background: theme.input, borderRadius: '12px', padding: '20px', border: `1px solid ${theme.inputBorder}` }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: theme.text }}>Groups</h3>
                  {groups.map(g => (<button key={g} onClick={() => setSelectedGroup(g)} style={{ ...s.btn, ...(selectedGroup === g ? s.btnPrimary : s.btnSecondary), justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}><span>{g}</span><span style={{ fontSize: '11px', opacity: 0.8 }}>{contacts.filter(c => g === 'All' || c.group === g).length}</span></button>))}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flex: 1, position: 'relative' }}><Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} /><input style={{ ...s.input, paddingLeft: '40px', marginBottom: 0 }} placeholder="Search contacts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                  <select style={{ ...s.input, width: 'auto', marginBottom: 0 }} value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="email">Sort by Email</option><option value="name">Sort by Name</option><option value="company">Sort by Company</option><option value="status">Sort by Status</option></select>
                  <button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} style={{ ...s.btn, ...s.btnSecondary }}><SortAsc size={16} style={{ transform: sortOrder === 'desc' ? 'scaleY(-1)' : 'none' }} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  {[{ l: 'Total', v: contacts.length, c: theme.accent }, { l: 'Ready', v: contacts.filter(c => c.status === 'ready').length, c: '#60a5fa' }, { l: 'Sent', v: contacts.filter(c => c.status === 'sent').length, c: theme.success }, { l: 'Failed', v: contacts.filter(c => c.status === 'failed').length, c: theme.danger }].map(st => (<div key={st.l} style={s.statBox}><div style={{ fontSize: '22px', fontWeight: '700', color: st.c }}>{st.v}</div><div style={{ fontSize: '12px', color: theme.textMuted }}>{st.l}</div></div>))}
                </div>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {filteredContacts.length ? filteredContacts.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: c.selected ? `${theme.accent}15` : theme.input, borderRadius: '10px', marginBottom: '8px', gap: '12px', border: `1px solid ${c.selected ? theme.accent + '40' : theme.inputBorder}` }}>
                      <input type="checkbox" checked={c.selected} onChange={() => setContacts(p => p.map(x => x.id === c.id ? { ...x, selected: !x.selected } : x))} style={{ width: '18px', height: '18px', accentColor: theme.accent }} />
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '14px' }}>{c.name.charAt(0).toUpperCase()}</div>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: '600', color: theme.text }}>{c.name}</div><div style={{ fontSize: '12px', color: theme.textMuted }}>{c.email}</div></div>
                      <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.input, padding: '4px 10px', borderRadius: '6px' }}>{c.company}</span>
                      <span style={{ fontSize: '12px', color: theme.textMuted, background: theme.input, padding: '4px 10px', borderRadius: '6px' }}>{c.group}</span>
                      <span style={{ ...s.badge, background: c.status === 'sent' ? `${theme.success}20` : c.status === 'failed' ? `${theme.danger}20` : `${theme.accent}20`, color: c.status === 'sent' ? theme.success : c.status === 'failed' ? theme.danger : theme.accent }}>{c.status === 'sent' && <CheckCircle size={12} />}{c.status === 'failed' && <XCircle size={12} />}{c.status === 'ready' && <Circle size={12} />}{c.status}</span>
                      <button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ ...s.btnIcon, color: theme.danger }}><Trash2 size={16} /></button>
                    </div>
                  )) : (<div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}><Users size={64} style={{ opacity: 0.3, marginBottom: '16px' }} /><p style={{ fontSize: '16px', marginBottom: '8px' }}>No contacts found</p><p style={{ fontSize: '13px' }}>Import contacts using the panel on the left</p></div>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: theme.text }}>Email Templates</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => exportData('templates')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18} /> Export</button>
                <button onClick={() => { setNewTemplate({ name: '', subject: '', body: '', tags: [] }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18} /> New Template</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {templates.map(t => (
                <div key={t.id} style={{ border: `2px solid ${t.selected ? theme.success : theme.cardBorder}`, borderRadius: '14px', padding: '20px', background: t.selected ? `${theme.success}08` : theme.card }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontWeight: '600', margin: 0, color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color={theme.accent} /> {t.name}</h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => toggleTemplate(t.id)} style={{ ...s.btnIcon, color: t.selected ? theme.success : theme.textMuted }}>{t.selected ? <CheckCircle size={18} /> : <Circle size={18} />}</button>
                      <button onClick={() => { setNewTemplate({ ...t }); setEditingTemplate(t); setShowTemplateModal(true); }} style={{ ...s.btnIcon, color: theme.accent }}><Edit3 size={16} /></button>
                      <button onClick={() => copyToClipboard(t.body)} style={{ ...s.btnIcon, color: theme.textMuted }}><Copy size={16} /></button>
                      <button onClick={() => setTemplates(p => p.filter(x => x.id !== t.id))} style={{ ...s.btnIcon, color: theme.danger }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: theme.accent, marginBottom: '8px', fontWeight: '500' }}>{t.subject}</div>
                  <div style={{ fontSize: '13px', color: theme.textMuted, maxHeight: '60px', overflow: 'hidden', marginBottom: '12px' }} dangerouslySetInnerHTML={{ __html: t.body.replace(/<[^>]+>/g, ' ').slice(0, 100) + '...' }} />
                  {t.tags?.length > 0 && (<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>{t.tags.map(tag => (<span key={tag} style={{ ...s.badge, background: `${theme.accent}20`, color: theme.accent, fontSize: '10px', padding: '2px 8px' }}>#{tag}</span>))}</div>)}
                  <button onClick={() => setEmailData(p => ({ ...p, subject: t.subject, body: t.body }))} style={{ ...s.btn, ...s.btnPrimary, width: '100%' }}>Use Template</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMTP TAB */}
        {activeTab === 'smtp' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: theme.text }}>SMTP Accounts</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={testAllSmtp} style={{ ...s.btn, ...s.btnWarning }}><RefreshCw size={18} /> Test All</button>
                <button onClick={() => setShowSmtpImportModal(true)} style={{ ...s.btn, ...s.btnSecondary }}><Upload size={18} /> Bulk Import</button>
                <button onClick={() => exportData('smtp')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18} /> Export</button>
                <button onClick={() => { setNewSmtp({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true, dailyLimit: 10000, encryption: 'STARTTLS' }); setEditingSmtp(null); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18} /> Add SMTP</button>
              </div>
            </div>
            <div style={{ background: `${theme.accent}10`, borderRadius: '12px', padding: '20px', marginBottom: '24px', border: `1px solid ${theme.accent}30` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: theme.accent, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> Quick Setup Presets</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[{ n: 'Office 365', h: 'smtp.office365.com', p: '587', icon: '📧' }, { n: 'Gmail', h: 'smtp.gmail.com', p: '587', icon: '📨' }, { n: 'Outlook', h: 'smtp-mail.outlook.com', p: '587', icon: '📬' }, { n: 'SendGrid', h: 'smtp.sendgrid.net', p: '587', icon: '🚀' }, { n: 'Mailgun', h: 'smtp.mailgun.org', p: '587', icon: '📮' }, { n: 'Amazon SES', h: 'email-smtp.us-east-1.amazonaws.com', p: '587', icon: '☁️' }, { n: 'Zoho', h: 'smtp.zoho.com', p: '587', icon: '📩' }, { n: 'Yahoo', h: 'smtp.mail.yahoo.com', p: '587', icon: '✉️' }].map(pr => (<button key={pr.n} onClick={() => { setNewSmtp(p => ({ ...p, name: pr.n, host: pr.h, port: pr.p })); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}>{pr.icon} {pr.n}</button>))}
              </div>
            </div>
            <div>
              {smtpAccounts.map(sm => (
                <div key={sm.id} style={{ border: `2px solid ${sm.enabled ? theme.cardBorder : theme.danger + '40'}`, borderRadius: '14px', padding: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: sm.enabled ? theme.card : `${theme.danger}08`, opacity: sm.enabled ? 1 : 0.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input type="checkbox" checked={sm.enabled} onChange={() => setSmtpAccounts(p => p.map(x => x.id === sm.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: '22px', height: '22px', accentColor: theme.accent }} />
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={24} color="#fff" /></div>
                    <div><h3 style={{ margin: 0, fontWeight: '600', color: theme.text }}>{sm.name}</h3><div style={{ fontSize: '13px', color: theme.textMuted }}>{sm.host}:{sm.port} • {sm.encryption}</div>{sm.username && <div style={{ fontSize: '12px', color: theme.textMuted }}>{sm.username}</div>}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ ...s.badge, background: sm.status === 'success' ? `${theme.success}20` : sm.status === 'failed' ? `${theme.danger}20` : theme.input, color: sm.status === 'success' ? theme.success : sm.status === 'failed' ? theme.danger : theme.textMuted }}>{sm.status === 'success' ? <><Wifi size={12} /> Connected</> : sm.status === 'failed' ? <><WifiOff size={12} /> Failed</> : 'Untested'}</span>
                    <button onClick={() => testSmtp(sm.id)} disabled={testingSmtpId === sm.id} style={{ ...s.btn, ...s.btnSmall, ...s.btnWarning }}>{testingSmtpId === sm.id ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <TestTube size={14} />} Test</button>
                    <button onClick={() => { setNewSmtp({ ...sm }); setEditingSmtp(sm); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSmall, ...s.btnSecondary }}><Edit3 size={14} /></button>
                    <button onClick={() => smtpAccounts.length > 1 && setSmtpAccounts(p => p.filter(x => x.id !== sm.id))} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: theme.text }}>Campaign History</h2>
              <button onClick={() => exportData('campaigns')} style={{ ...s.btn, ...s.btnSecondary }}><Download size={18} /> Export</button>
            </div>
            {campaigns.length ? campaigns.map(c => (
              <div key={c.id} style={{ border: `2px solid ${theme.cardBorder}`, borderRadius: '14px', padding: '24px', marginBottom: '16px', background: theme.card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div><h3 style={{ margin: 0, fontWeight: '600', color: theme.text }}>{c.name}</h3><div style={{ fontSize: '13px', color: theme.textMuted, marginTop: '4px' }}>{c.date}</div></div>
                  <span style={{ ...s.badge, background: c.status === 'completed' ? `${theme.success}20` : `${theme.warning}20`, color: c.status === 'completed' ? theme.success : theme.warning }}>{c.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />} {c.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[{ l: 'Total', v: c.total, c: theme.textMuted }, { l: 'Sent', v: c.sent, c: theme.success }, { l: 'Failed', v: c.failed, c: theme.danger }, { l: 'Success Rate', v: c.total ? Math.round(c.sent / c.total * 100) + '%' : '0%', c: theme.accent }].map(st => (<div key={st.l} style={s.statBox}><div style={{ fontSize: '24px', fontWeight: '700', color: st.c }}>{st.v}</div><div style={{ fontSize: '12px', color: theme.textMuted }}>{st.l}</div></div>))}
                </div>
              </div>
            )) : (<div style={{ textAlign: 'center', padding: '80px', color: theme.textMuted }}><BarChart3 size={80} style={{ opacity: 0.3, marginBottom: '20px' }} /><p style={{ fontSize: '18px', marginBottom: '8px' }}>No campaigns yet</p><p style={{ fontSize: '14px' }}>Start sending to create your first campaign</p></div>)}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={s.card}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: theme.text }}>Settings & Help</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ background: theme.input, borderRadius: '12px', padding: '24px', border: `1px solid ${theme.inputBorder}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} /> Contact Import Examples</h3>
                <div style={s.codeBlock}>{`# Simple list (one per line):
john@example.com
jane@company.org
mike@test.net

# CSV format:
email@domain.com, Name Here
user@site.org, John Doe

# Mixed formats (auto-detected):
John Doe <john@example.com>
jane@company.org
"Mike Smith" <mike@test.net>`}</div>
                <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '12px' }}>Supports TXT, CSV files. Emails are auto-extracted from any format.</p>
              </div>
              <div style={{ background: theme.input, borderRadius: '12px', padding: '24px', border: `1px solid ${theme.inputBorder}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}><Server size={20} /> SMTP Bulk Import Format</h3>
                <div style={s.codeBlock}>{`# Format: host|port|username|password|fromName|fromEmail|accountName
# Separators: | (pipe), , (comma), or tab

# Example with pipe separator:
smtp.office365.com|587|user@domain.com|password123|John Doe|john@domain.com|Office365 Main

# Example with comma:
smtp.gmail.com,587,user@gmail.com,apppassword,Jane,jane@gmail.com,Gmail Account

# Minimum required (4 fields):
smtp.example.com|587|user@example.com|password`}</div>
                <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '12px' }}>Import multiple SMTP accounts at once. Each line = one account.</p>
              </div>
              <div style={{ background: theme.input, borderRadius: '12px', padding: '24px', border: `1px solid ${theme.inputBorder}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} /> Merge Fields Reference</h3>
                <div style={s.codeBlock}>{`Available merge fields:
{{name}}      - Contact's name
{{email}}     - Contact's email
{{company}}   - Contact's company
{{sender}}    - Your sender name
{{date}}      - Current date
{{unsubscribe}} - Unsubscribe link

Example usage:
<p>Hi {{name}},</p>
<p>Thanks for your interest in {{company}}!</p>
<p>Best, {{sender}}</p>`}</div>
              </div>
              <div style={{ background: theme.input, borderRadius: '12px', padding: '24px', border: `1px solid ${theme.inputBorder}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={20} /> Quick Tips</h3>
                <ul style={{ fontSize: '13px', lineHeight: '2', color: theme.text, paddingLeft: '20px', margin: 0 }}>
                  <li><strong>Message Rotation:</strong> Improves deliverability by varying content</li>
                  <li><strong>SMTP Rotation:</strong> Distributes sending load across servers</li>
                  <li><strong>Delays:</strong> Add 1-5 second delays to avoid rate limits</li>
                  <li><strong>Test First:</strong> Always test SMTP connections before campaigns</li>
                  <li><strong>Personalize:</strong> Use merge fields for higher engagement</li>
                  <li><strong>Export:</strong> Regularly backup your contacts and templates</li>
                </ul>
              </div>
            </div>
          </div>
        )}
`# Use pipe (|), comma (,), or tab as separator
# Format: host|port|username|password|fromName|fromEmail|name

# Examples:
smtp.office365.com|587|user@company.com|pass123|John|john@company.com|Office Main
smtp.gmail.com|587|user@gmail.com|apppass|Jane|jane@gmail.com|Gmail Backup`}</div>
              </div>
              <textarea style={{ ...s.textarea, minHeight: '150px' }} placeholder="Paste your SMTP accounts here (one per line)..." value={smtpImportText} onChange={e => setSmtpImportText(e.target.value)} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={handleSmtpImport} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={18} /> Import SMTPs</button>
                <label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={18} /> Upload File<input ref={smtpFileInputRef} type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleSmtpFileUpload} /></label>
              </div>
            </div>
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && (
          <div style={s.modal} onClick={() => setShowTemplateModal(false)}>
            <div style={s.modalContent} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}><h2 style={{ margin: 0, color: theme.text }}>{editingTemplate ? 'Edit' : 'New'} Template</h2><button onClick={() => setShowTemplateModal(false)} style={s.btnIcon}><X size={24} /></button></div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Template Name *</label><input style={s.input} placeholder="My Template" value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Subject Line</label><input style={s.input} placeholder="Email subject with {{name}} merge fields" value={newTemplate.subject} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))} /></div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: theme.textMuted }}>Insert:</span>
                {mergeFields.map(f => (<button key={f} onClick={() => setNewTemplate(p => ({ ...p, body: p.body + ' ' + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 8px', fontSize: '11px' }}>{f}</button>))}
              </div>
              <div><label style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>Email Body (HTML supported)</label><textarea style={{ ...s.textarea, minHeight: '180px' }} placeholder="<p>Hi {{name}},</p><p>Your email content here...</p>" value={newTemplate.body} onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))} /></div>
              <button onClick={saveTemplate} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: '12px', justifyContent: 'center' }}>{editingTemplate ? 'Update' : 'Save'} Template</button>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelpModal && (
          <div style={s.modal} onClick={() => setShowHelpModal(false)}>
            <div style={{ ...s.modalContent, maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}><h2 style={{ margin: 0, color: theme.text }}>📚 Help & Documentation</h2><button onClick={() => setShowHelpModal(false)} style={s.btnIcon}><X size={24} /></button></div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ background: theme.input, borderRadius: '10px', padding: '16px', border: `1px solid ${theme.inputBorder}` }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px', color: theme.accent }}>🚀 Quick Start</h3>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: theme.text }}>
                    <li>Add your SMTP accounts in the SMTP tab</li>
                    <li>Import contacts via paste or file upload</li>
                    <li>Create or select email templates</li>
                    <li>Enable rotation for better deliverability</li>
                    <li>Preview your email and send!</li>
                  </ol>
                </div>
                <div style={{ background: theme.input, borderRadius: '10px', padding: '16px', border: `1px solid ${theme.inputBorder}` }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px', color: theme.accent }}>⚡ Features</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: theme.text }}>
                    <li><strong>Message Rotation:</strong> Alternate between templates to avoid spam filters</li>
                    <li><strong>SMTP Rotation:</strong> Distribute load across multiple SMTP servers</li>
                    <li><strong>Merge Fields:</strong> Personalize emails with recipient data</li>
                    <li><strong>Live Preview:</strong> See how emails look on desktop/mobile</li>
                    <li><strong>Bulk Import:</strong> Import contacts and SMTP accounts in bulk</li>
                    <li><strong>Export:</strong> Backup all your data to files</li>
                  </ul>
                </div>
                <div style={{ background: theme.input, borderRadius: '10px', padding: '16px', border: `1px solid ${theme.inputBorder}` }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px', color: theme.accent }}>⌨️ Keyboard Shortcuts</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: theme.text }}>
                    <span>Select All Contacts: Click "Select All"</span>
                    <span>Preview Email: Click "Preview" button</span>
                    <span>Save Template: Click save icon</span>
                    <span>Test SMTP: Click "Test" on any account</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Import Help Modal */}
        {showContactImportHelp && (
          <div style={s.modal} onClick={() => setShowContactImportHelp(false)}>
            <div style={s.modalContent} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}><h2 style={{ margin: 0, color: theme.text }}>📧 Contact Import Help</h2><button onClick={() => setShowContactImportHelp(false)} style={s.btnIcon}><X size={24} /></button></div>
              <div style={s.codeBlock}>{`# SUPPORTED FORMATS

# 1. Simple email list:
john@example.com
jane@company.org
mike@test.net

# 2. Name <email> format:
John Doe <john@example.com>
"Jane Smith" <jane@company.org>

# 3. CSV format:
john@example.com, John Doe
jane@company.org, Jane Smith

# 4. Mixed text (emails auto-extracted):
Contact John at john@example.com for more info.
You can also reach jane@company.org or mike@test.net.

# FILE UPLOAD
- Supports .txt and .csv files
- Emails are automatically extracted from any format
- Duplicates are automatically removed`}</div>
              <button onClick={() => setShowContactImportHelp(false)} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: '16px', justifyContent: 'center' }}>Got it!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
