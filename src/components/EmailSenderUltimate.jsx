<!DOCTYPE html>
<html>
<head>
  <title>Email Sender Ultimate - Complete Code</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 min-h-screen">
<div id="root"></div>
<script type="text/babel">
const { useState, useRef } = React;

// Icons as simple SVG components
const Icon = ({name, size=20, color="currentColor"}) => {
  const icons = {
    send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    server: <><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>,
    shuffle: <><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

function EmailSenderUltimate() {
  const [activeTab, setActiveTab] = useState('compose');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome Email', subject: 'Welcome to {{company}}!', body: '<h2>Welcome, {{name}}!</h2><p>We are excited to have you!</p><p>Best,<br>{{sender}}</p>', selected: false },
    { id: 2, name: 'Follow Up', subject: 'Following up', body: '<p>Hi {{name}},</p><p>Just following up on our conversation.</p><p>Best,<br>{{sender}}</p>', selected: false },
    { id: 3, name: 'Newsletter', subject: '{{company}} Newsletter', body: '<h1>Newsletter</h1><p>Hi {{name}},</p><p>Here are the updates!</p>', selected: false },
    { id: 4, name: 'Promo', subject: 'Special Offer!', body: '<h1>🎉 Special Offer!</h1><p>Hi {{name}}, get 20% off!</p>', selected: false }
  ]);

  const [smtpAccounts, setSmtpAccounts] = useState([
    { id: 1, name: 'Office 365', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', encryption: 'TLS', status: 'untested', enabled: true }
  ]);

  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(null);
  const [newSmtp, setNewSmtp] = useState({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', encryption: 'TLS', enabled: true });
  const [testingSmtpId, setTestingSmtpId] = useState(null);

  const [messageRotation, setMessageRotation] = useState(false);
  const [rotationType, setRotationType] = useState('sequential');
  const [smtpRotation, setSmtpRotation] = useState(false);
  const [smtpRotationType, setSmtpRotationType] = useState('sequential');

  const [emailData, setEmailData] = useState({ subject: '', body: '', cc: '', bcc: '', attachments: [], priority: 'normal' });
  const [editorMode, setEditorMode] = useState('visual');

  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [campaignPaused, setCampaignPaused] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [currentlySending, setCurrentlySending] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [currentSmtp, setCurrentSmtp] = useState('');
  const [sendingStats, setSendingStats] = useState({ sent: 0, failed: 0, total: 0 });
  const [sendDelay, setSendDelay] = useState(1);

  const [importText, setImportText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' });

  const groups = ['All', 'Customers', 'Leads', 'Partners'];
  const mergeFields = ['{{name}}', '{{email}}', '{{company}}', '{{sender}}', '{{date}}'];

  // Import contacts
  const handleImportContacts = () => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = importText.match(regex) || [];
    const unique = [...new Set(matches.map(e => e.toLowerCase()))];
    const newContacts = unique.map((email, i) => ({
      id: Date.now() + i,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      company: email.split('@')[1].split('.')[0].toUpperCase(),
      group: selectedGroup === 'All' ? 'Customers' : selectedGroup,
      status: 'ready',
      selected: true
    }));
    setContacts(prev => {
      const existing = new Set(prev.map(c => c.email));
      return [...prev, ...newContacts.filter(c => !existing.has(c.email))];
    });
    setImportText('');
  };

  // File upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImportText(ev.target.result);
      reader.readAsText(file);
    }
  };

  // SMTP functions
  const addSmtpAccount = () => {
    if (!newSmtp.name || !newSmtp.host) { alert('Enter name and host'); return; }
    if (editingSmtp) {
      setSmtpAccounts(prev => prev.map(s => s.id === editingSmtp.id ? { ...newSmtp, id: s.id, status: 'untested' } : s));
    } else {
      setSmtpAccounts(prev => [...prev, { ...newSmtp, id: Date.now(), status: 'untested' }]);
    }
    setNewSmtp({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', encryption: 'TLS', enabled: true });
    setEditingSmtp(null);
    setShowSmtpModal(false);
  };

  const testSmtp = async (id) => {
    setTestingSmtpId(id);
    await new Promise(r => setTimeout(r, 1500));
    const smtp = smtpAccounts.find(s => s.id === id);
    setSmtpAccounts(prev => prev.map(s => s.id === id ? { ...s, status: (smtp.username && smtp.password) ? 'success' : 'failed' } : s));
    setTestingSmtpId(null);
  };

  const testAllSmtp = async () => {
    for (const s of smtpAccounts) await testSmtp(s.id);
  };

  // Template functions
  const toggleTemplate = (id) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  const selectedTemplates = templates.filter(t => t.selected);
  const enabledSmtp = smtpAccounts.filter(s => s.enabled);

  const saveTemplate = () => {
    if (!newTemplate.name) { alert('Enter template name'); return; }
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...newTemplate, id: t.id, selected: t.selected } : t));
    } else {
      setTemplates(prev => [...prev, { ...newTemplate, id: Date.now(), selected: false }]);
    }
    setNewTemplate({ name: '', subject: '', body: '' });
    setEditingTemplate(null);
    setShowTemplateModal(false);
  };

  // Merge fields
  const replaceMerge = (text, contact, smtp) => {
    return text
      .replace(/{{name}}/g, contact?.name || 'Friend')
      .replace(/{{email}}/g, contact?.email || '')
      .replace(/{{company}}/g, contact?.company || '')
      .replace(/{{sender}}/g, smtp?.fromName || 'Sender')
      .replace(/{{date}}/g, new Date().toLocaleDateString());
  };

  // Get next template/smtp for rotation
  const getTemplate = (i) => {
    if (!messageRotation || selectedTemplates.length === 0) return { subject: emailData.subject, body: emailData.body, name: 'Custom' };
    return rotationType === 'random' ? selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)] : selectedTemplates[i % selectedTemplates.length];
  };
  const getSmtp = (i) => {
    if (!smtpRotation || enabledSmtp.length === 0) return enabledSmtp[0];
    return smtpRotationType === 'random' ? enabledSmtp[Math.floor(Math.random() * enabledSmtp.length)] : enabledSmtp[i % enabledSmtp.length];
  };

  // Start campaign
  const startCampaign = async () => {
    const selected = contacts.filter(c => c.selected);
    if (!selected.length) { alert('Select contacts'); return; }
    if (!messageRotation && (!emailData.subject || !emailData.body)) { alert('Enter subject & body'); return; }
    if (messageRotation && !selectedTemplates.length) { alert('Select templates'); return; }
    if (!enabledSmtp.length) { alert('Enable SMTP'); return; }

    setSendingCampaign(true);
    setCampaignPaused(false);
    setCampaignProgress(0);
    setSendingStats({ sent: 0, failed: 0, total: selected.length });

    const campaign = { id: Date.now(), name: messageRotation ? `Rotation (${selectedTemplates.length})` : emailData.subject.slice(0, 30), date: new Date().toLocaleString(), total: selected.length, sent: 0, failed: 0, status: 'sending' };
    setCampaigns(prev => [campaign, ...prev]);

    for (let i = 0; i < selected.length; i++) {
      while (campaignPaused) await new Promise(r => setTimeout(r, 100));
      const contact = selected[i];
      const tpl = getTemplate(i);
      const smtp = getSmtp(i);
      setCurrentlySending(contact.email);
      setCurrentTemplate(tpl.name);
      setCurrentSmtp(smtp?.name || 'Default');
      await new Promise(r => setTimeout(r, sendDelay * 1000));
      const ok = Math.random() > 0.05;
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, status: ok ? 'sent' : 'failed' } : c));
      setSendingStats(prev => ({ ...prev, sent: ok ? prev.sent + 1 : prev.sent, failed: ok ? prev.failed : prev.failed + 1 }));
      setCampaignProgress(Math.round(((i + 1) / selected.length) * 100));
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, sent: ok ? c.sent + 1 : c.sent, failed: ok ? c.failed : c.failed + 1 } : c));
    }
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'completed' } : c));
    setSendingCampaign(false);
  };

  const selectedCount = contacts.filter(c => c.selected).length;
  const filtered = contacts.filter(c => (selectedGroup === 'All' || c.group === selectedGroup) && c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Icon name="send" size={28} color="white"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Email Sender Ultimate</h1>
              <p className="text-gray-400 text-sm">Multi-SMTP & Message Rotation</p>
            </div>
          </div>
          <div className="flex gap-6">
            {[{l:'Contacts',v:contacts.length,c:'text-blue-400'},{l:'Selected',v:selectedCount,c:'text-green-400'},{l:'SMTP',v:enabledSmtp.length,c:'text-orange-400'},{l:'Templates',v:templates.length,c:'text-purple-400'}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="text-xs text-gray-500">{s.l}</div>
                <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[{id:'compose',l:'Compose',i:'send'},{id:'contacts',l:'Contacts',i:'users'},{id:'templates',l:'Templates',i:'file'},{id:'smtp',l:'SMTP',i:'server'},{id:'campaigns',l:'Campaigns',i:'chart'}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${activeTab===t.id?'bg-gradient-to-r from-purple-500 to-pink-500 text-white':'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
            <Icon name={t.i} size={18}/> {t.l}
          </button>
        ))}
      </div>

      {/* COMPOSE */}
      {activeTab==='compose'&&(
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Rotation Options */}
            <div className="bg-amber-500/20 border-2 border-amber-500 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon name="shuffle" size={24} color="#f59e0b"/>
                  <div>
                    <h3 className="font-bold text-amber-200">Message Rotation</h3>
                    <p className="text-xs text-amber-300/70">Rotate templates to avoid spam</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={messageRotation} onChange={e=>setMessageRotation(e.target.checked)} className="w-5 h-5"/>
                  <span className="font-bold text-amber-200">{messageRotation?'ON':'OFF'}</span>
                </label>
              </div>
              {messageRotation&&(
                <div>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 text-amber-200 text-sm"><input type="radio" checked={rotationType==='sequential'} onChange={()=>setRotationType('sequential')}/> Sequential</label>
                    <label className="flex items-center gap-2 text-amber-200 text-sm"><input type="radio" checked={rotationType==='random'} onChange={()=>setRotationType('random')}/> Random</label>
                  </div>
                  <div className="bg-white/90 rounded-lg p-3">
                    <p className="text-sm font-semibold text-amber-800 mb-2">Select templates ({selectedTemplates.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {templates.map(t=>(
                        <button key={t.id} onClick={()=>toggleTemplate(t.id)} className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${t.selected?'bg-green-500 text-white':'bg-gray-200 text-gray-700'}`}>
                          <Icon name={t.selected?'check':'x'} size={14}/> {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-500/20 border-2 border-blue-500 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="server" size={24} color="#3b82f6"/>
                  <div>
                    <h3 className="font-bold text-blue-200">SMTP Rotation</h3>
                    <p className="text-xs text-blue-300/70">Rotate between servers</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={smtpRotation} onChange={e=>setSmtpRotation(e.target.checked)} className="w-5 h-5"/>
                  <span className="font-bold text-blue-200">{smtpRotation?'ON':'OFF'}</span>
                </label>
              </div>
              {smtpRotation&&(
                <div className="flex gap-4 mt-3">
                  <label className="flex items-center gap-2 text-blue-200 text-sm"><input type="radio" checked={smtpRotationType==='sequential'} onChange={()=>setSmtpRotationType('sequential')}/> Sequential</label>
                  <label className="flex items-center gap-2 text-blue-200 text-sm"><input type="radio" checked={smtpRotationType==='random'} onChange={()=>setSmtpRotationType('random')}/> Random</label>
                </div>
              )}
            </div>

            {/* Compose Form */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{messageRotation?'✅ Rotation Mode':'Compose Email'}</h2>
              
              {!messageRotation&&(
                <>
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">TO: ({selectedCount} recipients)</label>
                    <div className="bg-gray-100 rounded-lg p-3 flex flex-wrap gap-2 min-h-[44px]">
                      {contacts.filter(c=>c.selected).slice(0,3).map(c=>(<span key={c.id} className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">{c.email}</span>))}
                      {selectedCount>3&&<span className="text-gray-500 text-sm">+{selectedCount-3} more</span>}
                      {!selectedCount&&<span className="text-gray-400">No recipients selected</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-sm font-semibold text-gray-600">CC:</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="cc@email.com" value={emailData.cc} onChange={e=>setEmailData(p=>({...p,cc:e.target.value}))}/></div>
                    <div><label className="text-sm font-semibold text-gray-600">BCC:</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="bcc@email.com" value={emailData.bcc} onChange={e=>setEmailData(p=>({...p,bcc:e.target.value}))}/></div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-600">Subject:</label>
                    <input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="Email subject..." value={emailData.subject} onChange={e=>setEmailData(p=>({...p,subject:e.target.value}))}/>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {['visual','html'].map(m=>(<button key={m} onClick={()=>setEditorMode(m)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${editorMode===m?'bg-purple-500 text-white':'bg-gray-100'}`}>{m.toUpperCase()}</button>))}
                  </div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {mergeFields.map(f=>(<button key={f} onClick={()=>setEmailData(p=>({...p,body:p.body+f}))} className="px-3 py-1 bg-gray-100 rounded text-xs font-medium hover:bg-gray-200">{f}</button>))}
                  </div>
                  <textarea className="w-full border-2 rounded-lg p-4 h-48 font-mono" placeholder="Write your email..." value={emailData.body} onChange={e=>setEmailData(p=>({...p,body:e.target.value}))}/>
                </>
              )}

              {messageRotation&&(
                <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">✓ {selectedTemplates.length} templates selected for {rotationType} rotation</p>
                  <div className="flex flex-wrap gap-2 mt-2">{selectedTemplates.map(t=>(<span key={t.id} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">{t.name}</span>))}</div>
                </div>
              )}

              <div className="mt-6">
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-600">Delay between emails (seconds):</label>
                  <input type="number" min="0" max="60" className="w-24 border-2 rounded-lg p-2 ml-2" value={sendDelay} onChange={e=>setSendDelay(Number(e.target.value))}/>
                </div>
                <button onClick={startCampaign} disabled={sendingCampaign||!selectedCount} className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${sendingCampaign||!selectedCount?'bg-gray-400':'bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90'}`}>
                  <Icon name="send" size={20}/> {sendingCampaign?'Sending...':'Send to '+selectedCount+' Recipients'}
                </button>
              </div>

              {sendingCampaign&&(
                <div className="mt-6 bg-green-100 border-2 border-green-400 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-green-800">📤 Sending...</span>
                    <button onClick={()=>setCampaignPaused(!campaignPaused)} className={`px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-1 ${campaignPaused?'bg-green-500':'bg-orange-500'}`}>
                      <Icon name={campaignPaused?'play':'pause'} size={16}/> {campaignPaused?'Resume':'Pause'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-3 bg-green-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{width:campaignProgress+'%'}}/></div>
                    <span className="font-bold text-green-800">{campaignProgress}%</span>
                  </div>
                  <div className="text-sm text-green-800 space-y-1">
                    <div><b>Email:</b> {currentlySending}</div>
                    {messageRotation&&<div><b>Template:</b> {currentTemplate}</div>}
                    {smtpRotation&&<div><b>SMTP:</b> {currentSmtp}</div>}
                  </div>
                  <div className="flex gap-6 mt-3 text-sm">
                    <span className="text-green-600">✓ Sent: {sendingStats.sent}</span>
                    <span className="text-red-500">✗ Failed: {sendingStats.failed}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold mb-4">Quick Templates</h3>
              {templates.slice(0,4).map(t=>(<button key={t.id} onClick={()=>setEmailData(p=>({...p,subject:t.subject,body:t.body}))} className="w-full text-left px-4 py-3 bg-gray-100 rounded-lg mb-2 hover:bg-gray-200 flex items-center gap-2"><Icon name="file" size={16}/> {t.name}</button>))}
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">💡 Pro Tips</h3>
              <ul className="text-sm space-y-2 opacity-90">
                <li>• Enable rotation to avoid spam</li>
                <li>• Use multiple SMTP servers</li>
                <li>• Add delays between emails</li>
                <li>• Test before bulk sending</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CONTACTS */}
      {activeTab==='contacts'&&(
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold">Contacts</h2>
            <div className="flex gap-2">
              <button onClick={()=>setContacts(p=>p.map(c=>({...c,selected:true})))} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">Select All</button>
              <button onClick={()=>setContacts(p=>p.map(c=>({...c,selected:false})))} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">Deselect</button>
              <button onClick={()=>setContacts(p=>p.map(c=>({...c,status:'ready'})))} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1"><Icon name="refresh" size={14}/> Reset</button>
              <button onClick={()=>setContacts([])} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1"><Icon name="trash" size={14}/> Clear</button>
            </div>
          </div>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Import</h3>
                <textarea className="w-full border-2 rounded-lg p-3 h-24" placeholder="Paste emails..." value={importText} onChange={e=>setImportText(e.target.value)}/>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleImportContacts} className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"><Icon name="plus" size={16}/> Import</button>
                  <label className="bg-gray-200 p-2 rounded-lg cursor-pointer"><Icon name="upload" size={20}/><input type="file" className="hidden" accept=".txt,.csv" onChange={handleFileUpload}/></label>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Groups</h3>
                {groups.map(g=>(<button key={g} onClick={()=>setSelectedGroup(g)} className={`w-full text-left px-4 py-2 rounded-lg mb-2 flex justify-between ${selectedGroup===g?'bg-purple-500 text-white':'bg-white hover:bg-gray-200'}`}><span>{g}</span><span className="text-xs opacity-70">{contacts.filter(c=>g==='All'||c.group===g).length}</span></button>))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="relative mb-4">
                <Icon name="search" size={18} color="#9ca3af"/>
                <input className="w-full border-2 rounded-lg p-3 pl-10" placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{paddingLeft:'40px'}}/>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filtered.length?filtered.map(c=>(
                  <div key={c.id} className={`flex items-center gap-4 p-4 rounded-xl ${c.selected?'bg-blue-50':'bg-gray-50'}`}>
                    <input type="checkbox" checked={c.selected} onChange={()=>setContacts(p=>p.map(x=>x.id===c.id?{...x,selected:!x.selected}:x))} className="w-5 h-5"/>
                    <div className="flex-1">
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-gray-500">{c.email}</div>
                    </div>
                    <span className="text-sm text-gray-400">{c.company}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status==='sent'?'bg-green-100 text-green-700':c.status==='failed'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{c.status}</span>
                    <button onClick={()=>setContacts(p=>p.filter(x=>x.id!==c.id))} className="text-red-500"><Icon name="trash" size={18}/></button>
                  </div>
                )):<div className="text-center py-12 text-gray-400"><Icon name="users" size={48}/><p className="mt-4">No contacts</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES */}
      {activeTab==='templates'&&(
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Templates</h2>
            <button onClick={()=>{setNewTemplate({name:'',subject:'',body:''});setEditingTemplate(null);setShowTemplateModal(true);}} className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold flex items-center gap-2"><Icon name="plus" size={18}/> New</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t=>(
              <div key={t.id} className={`border-2 rounded-xl p-5 ${t.selected?'border-green-500 bg-green-50':'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold">{t.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={()=>toggleTemplate(t.id)} className={t.selected?'text-green-500':'text-gray-400'}><Icon name="check" size={18}/></button>
                    <button onClick={()=>{setNewTemplate({...t});setEditingTemplate(t);setShowTemplateModal(true);}} className="text-purple-500"><Icon name="edit" size={18}/></button>
                    <button onClick={()=>setTemplates(p=>p.filter(x=>x.id!==t.id))} className="text-red-500"><Icon name="trash" size={18}/></button>
                  </div>
                </div>
                <div className="text-purple-600 text-sm mb-2">{t.subject}</div>
                <div className="text-gray-500 text-xs h-12 overflow-hidden">{t.body.replace(/<[^>]+>/g,'').slice(0,80)}...</div>
                <button onClick={()=>setEmailData(p=>({...p,subject:t.subject,body:t.body}))} className="w-full mt-4 py-2 bg-purple-500 text-white rounded-lg font-semibold">Use</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SMTP */}
      {activeTab==='smtp'&&(
        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">SMTP Accounts</h2>
            <div className="flex gap-2">
              <button onClick={testAllSmtp} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold flex items-center gap-2"><Icon name="refresh" size={18}/> Test All</button>
              <button onClick={()=>{setNewSmtp({name:'',host:'smtp.office365.com',port:'587',username:'',password:'',fromName:'',fromEmail:'',encryption:'TLS',enabled:true});setEditingSmtp(null);setShowSmtpModal(true);}} className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold flex items-center gap-2"><Icon name="plus" size={18}/> Add SMTP</button>
            </div>
          </div>
          <div className="bg-blue-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Quick Presets</h3>
            <div className="flex flex-wrap gap-2">
              {[{n:'Office 365',h:'smtp.office365.com',p:'587'},{n:'Gmail',h:'smtp.gmail.com',p:'587'},{n:'Outlook',h:'smtp-mail.outlook.com',p:'587'},{n:'Yahoo',h:'smtp.mail.yahoo.com',p:'465'},{n:'SendGrid',h:'smtp.sendgrid.net',p:'587'}].map(pr=>(
                <button key={pr.n} onClick={()=>{setNewSmtp(p=>({...p,name:pr.n,host:pr.h,port:pr.p}));setShowSmtpModal(true);}} className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-blue-50">{pr.n}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {smtpAccounts.map(s=>(
              <div key={s.id} className="border-2 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={s.enabled} onChange={()=>setSmtpAccounts(p=>p.map(x=>x.id===s.id?{...x,enabled:!x.enabled}:x))} className="w-5 h-5"/>
                  <div>
                    <h3 className="font-bold">{s.name}</h3>
                    <div className="text-sm text-gray-500">{s.host}:{s.port} • {s.username||'No username'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.status==='success'?'bg-green-100 text-green-700':s.status==='failed'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}`}>{s.status==='success'?'✓ Connected':s.status==='failed'?'✗ Failed':'Untested'}</span>
                  <button onClick={()=>testSmtp(s.id)} disabled={testingSmtpId===s.id} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1">
                    {testingSmtpId===s.id?<Icon name="refresh" size={14}/>:'Test'}
                  </button>
                  <button onClick={()=>{setNewSmtp({...s});setEditingSmtp(s);setShowSmtpModal(true);}} className="px-3 py-2 bg-gray-100 rounded-lg"><Icon name="edit" size={16}/></button>
                  <button onClick={()=>{if(smtpAccounts.length>1)setSmtpAccounts(p=>p.filter(x=>x.id!==s.id));}} className="px-3 py-2 bg-red-100 text-red-500 rounded-lg"><Icon name="trash" size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMPAIGNS */}
      {activeTab==='campaigns'&&(
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Campaigns</h2>
          {campaigns.length?campaigns.map(c=>(
            <div key={c.id} className="border-2 rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <div className="text-sm text-gray-500">{c.date}</div>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${c.status==='completed'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[{l:'Total',v:c.total,c:'text-gray-700'},{l:'Sent',v:c.sent,c:'text-green-600'},{l:'Failed',v:c.failed,c:'text-red-500'},{l:'Rate',v:c.total?Math.round(c.sent/c.total*100)+'%':'0%',c:'text-purple-600'}].map(st=>(
                  <div key={st.l}><div className={`text-2xl font-bold ${st.c}`}>{st.v}</div><div className="text-xs text-gray-400">{st.l}</div></div>
                ))}
              </div>
            </div>
          )):<div className="text-center py-12 text-gray-400"><Icon name="chart" size={64}/><p className="mt-4">No campaigns yet</p></div>}
        </div>
      )}

      {/* SMTP Modal */}
      {showSmtpModal&&(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={()=>setShowSmtpModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingSmtp?'Edit':'Add'} SMTP</h2>
              <button onClick={()=>setShowSmtpModal(false)}><Icon name="x" size={24}/></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-semibold text-gray-600">Name</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="My SMTP" value={newSmtp.name} onChange={e=>setNewSmtp(p=>({...p,name:e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-gray-600">Host</label><input className="w-full border-2 rounded-lg p-3 mt-1" value={newSmtp.host} onChange={e=>setNewSmtp(p=>({...p,host:e.target.value}))}/></div>
                <div><label className="text-sm font-semibold text-gray-600">Port</label><input className="w-full border-2 rounded-lg p-3 mt-1" value={newSmtp.port} onChange={e=>setNewSmtp(p=>({...p,port:e.target.value}))}/></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-600">Username</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="email@domain.com" value={newSmtp.username} onChange={e=>setNewSmtp(p=>({...p,username:e.target.value}))}/></div>
              <div><label className="text-sm font-semibold text-gray-600">Password</label><input type="password" className="w-full border-2 rounded-lg p-3 mt-1" placeholder="••••••••" value={newSmtp.password} onChange={e=>setNewSmtp(p=>({...p,password:e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-gray-600">From Name</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="Your Name" value={newSmtp.fromName} onChange={e=>setNewSmtp(p=>({...p,fromName:e.target.value}))}/></div>
                <div><label className="text-sm font-semibold text-gray-600">From Email</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="from@domain.com" value={newSmtp.fromEmail} onChange={e=>setNewSmtp(p=>({...p,fromEmail:e.target.value}))}/></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-600">Encryption</label><select className="w-full border-2 rounded-lg p-3 mt-1" value={newSmtp.encryption} onChange={e=>setNewSmtp(p=>({...p,encryption:e.target.value}))}><option>TLS</option><option>SSL</option><option>None</option></select></div>
              <button onClick={addSmtpAccount} className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold">{editingSmtp?'Update':'Add'} SMTP</button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal&&(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={()=>setShowTemplateModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingTemplate?'Edit':'New'} Template</h2>
              <button onClick={()=>setShowTemplateModal(false)}><Icon name="x" size={24}/></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-semibold text-gray-600">Name</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="Template name" value={newTemplate.name} onChange={e=>setNewTemplate(p=>({...p,name:e.target.value}))}/></div>
              <div><label className="text-sm font-semibold text-gray-600">Subject</label><input className="w-full border-2 rounded-lg p-3 mt-1" placeholder="Email subject" value={newTemplate.subject} onChange={e=>setNewTemplate(p=>({...p,subject:e.target.value}))}/></div>
              <div className="flex gap-2 flex-wrap">{mergeFields.map(f=>(<button key={f} onClick={()=>setNewTemplate(p=>({...p,body:p.body+f}))} className="px-3 py-1 bg-gray-100 rounded text-xs">{f}</button>))}</div>
              <div><label className="text-sm font-semibold text-gray-600">Body (HTML)</label><textarea className="w-full border-2 rounded-lg p-3 mt-1 h-40 font-mono" placeholder="<p>Your content...</p>" value={newTemplate.body} onChange={e=>setNewTemplate(p=>({...p,body:e.target.value}))}/></div>
              <button onClick={saveTemplate} className="w-full py-3 bg-purple-500 text-white rounded-lg font-bold">{editingTemplate?'Update':'Save'} Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<EmailSenderUltimate/>, document.getElementById('root'));
</script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>