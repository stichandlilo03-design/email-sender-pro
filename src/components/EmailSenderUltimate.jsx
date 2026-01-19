import React, { useState } from 'react';
import { Send, Mail, Users, FileText, Upload, Trash2, Plus, Edit3, CheckCircle, XCircle, BarChart3, Pause, Play, Search, PenTool, Eye, Code, Bold, Italic, Underline, List, Link, Image, Paperclip, X, TestTube, Wifi, WifiOff, RefreshCw, Save, Server, Shuffle, Check, Circle, Monitor, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';

export default function EmailSenderUltimate() {
  const [activeTab, setActiveTab] = useState('compose');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome', subject: 'Welcome to {{company}}!', body: '<h2>Welcome {{name}}!</h2><p>Thanks for joining!</p>', selected: false },
    { id: 2, name: 'Follow Up', subject: 'Following up', body: '<p>Hi {{name}},</p><p>Just checking in.</p>', selected: false },
    { id: 3, name: 'Newsletter', subject: '{{company}} News', body: '<h1>Newsletter</h1><p>Hi {{name}}!</p>', selected: false },
    { id: 4, name: 'Promo', subject: 'Special Offer!', body: '<h1>🎉 20% OFF for {{name}}!</h1>', selected: false }
  ]);
  const [smtpAccounts, setSmtpAccounts] = useState([
    { id: 1, name: 'Office 365', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', status: 'untested', enabled: true }
  ]);
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(null);
  const [newSmtp, setNewSmtp] = useState({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true });
  const [testingSmtpId, setTestingSmtpId] = useState(null);
  const [messageRotation, setMessageRotation] = useState(false);
  const [rotationType, setRotationType] = useState('sequential');
  const [smtpRotation, setSmtpRotation] = useState(false);
  const [smtpRotationType, setSmtpRotationType] = useState('sequential');
  const [emailData, setEmailData] = useState({ subject: '', body: '', cc: '', bcc: '' });
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const groups = ['All', 'Customers', 'Leads', 'Partners'];
  const mergeFields = ['{{name}}', '{{email}}', '{{company}}', '{{sender}}', '{{date}}'];
  const selectedTemplates = templates.filter(t => t.selected);
  const enabledSmtp = smtpAccounts.filter(s => s.enabled);
  const selectedCount = contacts.filter(c => c.selected).length;
  const filtered = contacts.filter(c => (selectedGroup === 'All' || c.group === selectedGroup) && c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImportContacts = () => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = importText.match(regex) || [];
    const unique = [...new Set(matches.map(e => e.toLowerCase()))];
    const newContacts = unique.map((email, i) => ({
      id: Date.now() + i, email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      company: email.split('@')[1].split('.')[0].toUpperCase(),
      group: selectedGroup === 'All' ? 'Customers' : selectedGroup,
      status: 'ready', selected: true
    }));
    setContacts(prev => {
      const existing = new Set(prev.map(c => c.email));
      return [...prev, ...newContacts.filter(c => !existing.has(c.email))];
    });
    setImportText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onload = (ev) => setImportText(ev.target.result); reader.readAsText(file); }
  };

  const addSmtpAccount = () => {
    if (!newSmtp.name || !newSmtp.host) { alert('Enter name and host'); return; }
    if (editingSmtp) { setSmtpAccounts(prev => prev.map(s => s.id === editingSmtp.id ? { ...newSmtp, id: s.id, status: 'untested' } : s)); }
    else { setSmtpAccounts(prev => [...prev, { ...newSmtp, id: Date.now(), status: 'untested' }]); }
    setNewSmtp({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true });
    setEditingSmtp(null); setShowSmtpModal(false);
  };

  const testSmtp = async (id) => {
    setTestingSmtpId(id);
    await new Promise(r => setTimeout(r, 1500));
    const smtp = smtpAccounts.find(s => s.id === id);
    setSmtpAccounts(prev => prev.map(s => s.id === id ? { ...s, status: (smtp.username && smtp.password) ? 'success' : 'failed' } : s));
    setTestingSmtpId(null);
  };

  const testAllSmtp = async () => { for (const s of smtpAccounts) await testSmtp(s.id); };
  const toggleTemplate = (id) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));

  const saveTemplate = () => {
    if (!newTemplate.name) { alert('Enter name'); return; }
    if (editingTemplate) { setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...newTemplate, id: t.id, selected: t.selected } : t)); }
    else { setTemplates(prev => [...prev, { ...newTemplate, id: Date.now(), selected: false }]); }
    setNewTemplate({ name: '', subject: '', body: '' }); setEditingTemplate(null); setShowTemplateModal(false);
  };

  const getTemplate = (i) => {
    if (!messageRotation || !selectedTemplates.length) return { subject: emailData.subject, body: emailData.body, name: 'Custom' };
    return rotationType === 'random' ? selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)] : selectedTemplates[i % selectedTemplates.length];
  };

  const getSmtp = (i) => {
    if (!smtpRotation || !enabledSmtp.length) return enabledSmtp[0];
    return smtpRotationType === 'random' ? enabledSmtp[Math.floor(Math.random() * enabledSmtp.length)] : enabledSmtp[i % enabledSmtp.length];
  };

  const startCampaign = async () => {
    const selected = contacts.filter(c => c.selected);
    if (!selected.length) { alert('Select contacts'); return; }
    if (!messageRotation && (!emailData.subject || !emailData.body)) { alert('Enter subject & body'); return; }
    if (messageRotation && !selectedTemplates.length) { alert('Select templates'); return; }
    if (!enabledSmtp.length) { alert('Enable SMTP'); return; }
    setSendingCampaign(true); setCampaignPaused(false); setCampaignProgress(0);
    setSendingStats({ sent: 0, failed: 0, total: selected.length });
    const campaign = { id: Date.now(), name: messageRotation ? `Rotation (${selectedTemplates.length})` : emailData.subject.slice(0, 30), date: new Date().toLocaleString(), total: selected.length, sent: 0, failed: 0, status: 'sending' };
    setCampaigns(prev => [campaign, ...prev]);
    for (let i = 0; i < selected.length; i++) {
      while (campaignPaused) await new Promise(r => setTimeout(r, 100));
      const contact = selected[i]; const tpl = getTemplate(i); const smtp = getSmtp(i);
      setCurrentlySending(contact.email); setCurrentTemplate(tpl.name); setCurrentSmtp(smtp?.name || 'Default');
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

  const s = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: 24, fontFamily: 'system-ui, sans-serif' },
    card: { background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    cardDark: { background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
    input: { width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' },
    textarea: { width: '100%', minHeight: 180, padding: 16, border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 14, fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
    btn: { padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 },
    btnPrimary: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' },
    btnSuccess: { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' },
    btnDanger: { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' },
    btnWarning: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' },
    btnSecondary: { background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb' },
    btnSmall: { padding: '6px 12px', fontSize: 12 },
    tab: { padding: '12px 20px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
    tabActive: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' },
    tabInactive: { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' },
    badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: '#fff', borderRadius: 16, padding: 32, width: '90%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' },
    rotationBox: { background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: 12, padding: 20, border: '2px solid #f59e0b', marginBottom: 20 },
    smtpBox: { background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: 12, padding: 20, border: '2px solid #3b82f6', marginBottom: 20 }
  };

  return (
    <div style={s.container}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ ...s.cardDark, background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: 12, borderRadius: 12 }}><Send color="#fff" size={28} /></div>
              <div><h1 style={{ margin: 0, fontSize: 28 }}>Email Sender Ultimate</h1><p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 14 }}>Multi-SMTP & Message Rotation</p></div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[{ l: 'Contacts', v: contacts.length, c: '#60a5fa' }, { l: 'Selected', v: selectedCount, c: '#34d399' }, { l: 'SMTP', v: enabledSmtp.length, c: '#fbbf24' }, { l: 'Templates', v: templates.length, c: '#a78bfa' }].map(x => (
                <div key={x.l} style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: '#94a3b8' }}>{x.l}</div><div style={{ fontSize: 24, fontWeight: 700, color: x.c }}>{x.v}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ id: 'compose', icon: PenTool, l: 'Compose' }, { id: 'contacts', icon: Users, l: 'Contacts' }, { id: 'templates', icon: FileText, l: 'Templates' }, { id: 'smtp', icon: Server, l: 'SMTP' }, { id: 'campaigns', icon: BarChart3, l: 'Campaigns' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : s.tabInactive) }}><t.icon size={18} /> {t.l}</button>
          ))}
        </div>

        {/* COMPOSE */}
        {activeTab === 'compose' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div>
              <div style={s.card}>
                {/* Message Rotation */}
                <div style={s.rotationBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: messageRotation ? 16 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Shuffle size={24} color="#92400e" /><div><h3 style={{ margin: 0, color: '#92400e', fontSize: 16 }}>Message Rotation</h3><p style={{ margin: 0, fontSize: 12, color: '#a16207' }}>Rotate templates to avoid spam</p></div></div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={messageRotation} onChange={e => setMessageRotation(e.target.checked)} style={{ width: 20, height: 20 }} /><span style={{ fontWeight: 700, color: '#92400e' }}>{messageRotation ? 'ON' : 'OFF'}</span></label>
                  </div>
                  {messageRotation && (
                    <div>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={rotationType === 'sequential'} onChange={() => setRotationType('sequential')} /> Sequential</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={rotationType === 'random'} onChange={() => setRotationType('random')} /> Random</label>
                      </div>
                      <div style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#92400e' }}>Select templates ({selectedTemplates.length}):</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {templates.map(t => (<button key={t.id} onClick={() => toggleTemplate(t.id)} style={{ ...s.btn, ...s.btnSmall, ...(t.selected ? s.btnSuccess : s.btnSecondary) }}>{t.selected ? <Check size={14} /> : <Circle size={14} />} {t.name}</button>))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SMTP Rotation */}
                <div style={s.smtpBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: smtpRotation ? 16 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Server size={24} color="#1d4ed8" /><div><h3 style={{ margin: 0, color: '#1d4ed8', fontSize: 16 }}>SMTP Rotation</h3><p style={{ margin: 0, fontSize: 12, color: '#2563eb' }}>Rotate between servers</p></div></div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={smtpRotation} onChange={e => setSmtpRotation(e.target.checked)} style={{ width: 20, height: 20 }} /><span style={{ fontWeight: 700, color: '#1d4ed8' }}>{smtpRotation ? 'ON' : 'OFF'}</span></label>
                  </div>
                  {smtpRotation && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={smtpRotationType === 'sequential'} onChange={() => setSmtpRotationType('sequential')} /> Sequential</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><input type="radio" checked={smtpRotationType === 'random'} onChange={() => setSmtpRotationType('random')} /> Random</label>
                    </div>
                  )}
                </div>

                {!messageRotation && (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>TO: ({selectedCount} recipients)</label>
                      <div style={{ ...s.input, background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minHeight: 44, marginBottom: 0 }}>
                        {contacts.filter(c => c.selected).slice(0, 3).map(c => (<span key={c.id} style={{ background: '#667eea', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 12 }}>{c.email}</span>))}
                        {selectedCount > 3 && <span style={{ color: '#6b7280', fontSize: 12 }}>+{selectedCount - 3} more</span>}
                        {!selectedCount && <span style={{ color: '#9ca3af' }}>No recipients</span>}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>CC:</label><input style={{ ...s.input, marginBottom: 0, marginTop: 6 }} placeholder="cc@email.com" value={emailData.cc} onChange={e => setEmailData(p => ({ ...p, cc: e.target.value }))} /></div>
                      <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>BCC:</label><input style={{ ...s.input, marginBottom: 0, marginTop: 6 }} placeholder="bcc@email.com" value={emailData.bcc} onChange={e => setEmailData(p => ({ ...p, bcc: e.target.value }))} /></div>
                    </div>
                    <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Subject:</label><input style={{ ...s.input, marginTop: 6 }} placeholder="Email subject..." value={emailData.subject} onChange={e => setEmailData(p => ({ ...p, subject: e.target.value }))} /></div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {['visual', 'html'].map(m => (<button key={m} onClick={() => setEditorMode(m)} style={{ ...s.btn, ...s.btnSmall, ...(editorMode === m ? s.btnPrimary : s.btnSecondary) }}>{m === 'visual' ? <Eye size={14} /> : <Code size={14} />} {m.toUpperCase()}</button>))}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>Insert:</span>
                      {mergeFields.map(f => (<button key={f} onClick={() => setEmailData(p => ({ ...p, body: p.body + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 8px', fontSize: 11 }}>{f}</button>))}
                    </div>
                    <textarea style={s.textarea} placeholder="Write your email..." value={emailData.body} onChange={e => setEmailData(p => ({ ...p, body: e.target.value }))} />
                  </>
                )}

                {messageRotation && (
                  <div style={{ background: '#ecfdf5', borderRadius: 12, padding: 20, border: '2px solid #6ee7b7' }}>
                    <h3 style={{ margin: '0 0 8px', color: '#065f46' }}>✅ Rotation Active</h3>
                    <p style={{ margin: 0, color: '#047857', fontSize: 14 }}>{selectedTemplates.length} templates ({rotationType}){smtpRotation && `, ${enabledSmtp.length} SMTP`}</p>
                  </div>
                )}

                <div style={{ marginTop: 20, borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
                  <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#6b7280' }}>
                    {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Advanced Options
                  </button>
                  {showAdvanced && (
                    <div style={{ marginTop: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Delay (sec):</label>
                      <input type="number" min="0" max="60" style={{ ...s.input, width: 100, marginLeft: 12 }} value={sendDelay} onChange={e => setSendDelay(Number(e.target.value))} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={startCampaign} disabled={sendingCampaign || !selectedCount} style={{ ...s.btn, ...s.btnSuccess, flex: 1, opacity: (sendingCampaign || !selectedCount) ? 0.5 : 1 }}><Send size={18} /> {sendingCampaign ? 'Sending...' : `Send to ${selectedCount}`}</button>
                  <button onClick={() => { setNewTemplate({ name: '', subject: emailData.subject, body: emailData.body }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnSecondary }}><Save size={18} /></button>
                </div>

                {sendingCampaign && (
                  <div style={{ marginTop: 24, background: '#ecfdf5', borderRadius: 12, padding: 20, border: '2px solid #6ee7b7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, color: '#065f46' }}>📤 Sending...</span>
                      <button onClick={() => setCampaignPaused(!campaignPaused)} style={{ ...s.btn, ...s.btnSmall, background: campaignPaused ? '#10b981' : '#f59e0b', color: '#fff' }}>{campaignPaused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ flex: 1, height: 10, background: '#a7f3d0', borderRadius: 10, overflow: 'hidden' }}><div style={{ width: `${campaignProgress}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }} /></div>
                      <span style={{ fontWeight: 700, color: '#065f46' }}>{campaignProgress}%</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#065f46' }}><strong>Email:</strong> {currentlySending}</div>
                    {messageRotation && <div style={{ fontSize: 13, color: '#065f46' }}><strong>Template:</strong> {currentTemplate}</div>}
                    {smtpRotation && <div style={{ fontSize: 13, color: '#065f46' }}><strong>SMTP:</strong> {currentSmtp}</div>}
                    <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
                      <span style={{ color: '#10b981' }}>✓ Sent: {sendingStats.sent}</span>
                      <span style={{ color: '#ef4444' }}>✗ Failed: {sendingStats.failed}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div style={s.card}><h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Templates</h3>{templates.slice(0, 4).map(t => (<button key={t.id} onClick={() => setEmailData(p => ({ ...p, subject: t.subject, body: t.body }))} style={{ ...s.btn, ...s.btnSecondary, justifyContent: 'flex-start', width: '100%', marginBottom: 8 }}><FileText size={14} /> {t.name}</button>))}</div>
              <div style={{ ...s.card, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' }}><h3 style={{ fontSize: 16, marginBottom: 12 }}>💡 Tips</h3><ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}><li>Enable rotation</li><li>Use multiple SMTPs</li><li>Add delays</li></ul></div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === 'contacts' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Contacts</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: true })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}>Select All</button>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, selected: false })))} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}>Deselect</button>
                <button onClick={() => setContacts(p => p.map(c => ({ ...c, status: 'ready' })))} style={{ ...s.btn, ...s.btnWarning, ...s.btnSmall }}><RotateCcw size={14} /> Reset</button>
                <button onClick={() => setContacts([])} style={{ ...s.btn, ...s.btnDanger, ...s.btnSmall }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
              <div>
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Import</h3>
                  <textarea style={{ ...s.textarea, minHeight: 100 }} placeholder="Paste emails..." value={importText} onChange={e => setImportText(e.target.value)} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={handleImportContacts} style={{ ...s.btn, ...s.btnPrimary, flex: 1 }}><Plus size={16} /> Import</button>
                    <label style={{ ...s.btn, ...s.btnSecondary, cursor: 'pointer' }}><Upload size={16} /><input type="file" style={{ display: 'none' }} accept=".txt,.csv" onChange={handleFileUpload} /></label>
                  </div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Groups</h3>
                  {groups.map(g => (<button key={g} onClick={() => setSelectedGroup(g)} style={{ ...s.btn, ...(selectedGroup === g ? s.btnPrimary : s.btnSecondary), justifyContent: 'space-between', width: '100%', marginBottom: 8 }}><span>{g}</span><span style={{ fontSize: 11, opacity: 0.7 }}>{contacts.filter(c => g === 'All' || c.group === g).length}</span></button>))}
                </div>
              </div>
              <div>
                <div style={{ marginBottom: 16, position: 'relative' }}><Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} /><input style={{ ...s.input, paddingLeft: 40, marginBottom: 0 }} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div style={{ maxHeight: 450, overflowY: 'auto' }}>
                  {filtered.length ? filtered.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: 12, background: c.selected ? '#eff6ff' : '#f9fafb', borderRadius: 10, marginBottom: 8, gap: 12 }}>
                      <input type="checkbox" checked={c.selected} onChange={() => setContacts(p => p.map(x => x.id === c.id ? { ...x, selected: !x.selected } : x))} style={{ width: 18, height: 18 }} />
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{c.email}</div></div>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{c.company}</span>
                      <span style={{ ...s.badge, background: c.status === 'sent' ? '#dcfce7' : c.status === 'failed' ? '#fee2e2' : '#dbeafe', color: c.status === 'sent' ? '#166534' : c.status === 'failed' ? '#dc2626' : '#1d4ed8' }}>{c.status}</span>
                      <button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  )) : <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}><Users size={48} style={{ opacity: 0.5, marginBottom: 16 }} /><p>No contacts</p></div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATES */}
        {activeTab === 'templates' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Templates</h2>
              <button onClick={() => { setNewTemplate({ name: '', subject: '', body: '' }); setEditingTemplate(null); setShowTemplateModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18} /> New</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {templates.map(t => (
                <div key={t.id} style={{ border: `2px solid ${t.selected ? '#10b981' : '#e5e7eb'}`, borderRadius: 12, padding: 20, background: t.selected ? '#ecfdf5' : '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontWeight: 600, margin: 0 }}>{t.name}</h3>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => toggleTemplate(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.selected ? '#10b981' : '#9ca3af' }}>{t.selected ? <CheckCircle size={18} /> : <Circle size={18} />}</button>
                      <button onClick={() => { setNewTemplate({ ...t }); setEditingTemplate(t); setShowTemplateModal(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#667eea' }}><Edit3 size={16} /></button>
                      <button onClick={() => setTemplates(p => p.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: '#667eea', marginBottom: 8 }}>{t.subject}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', maxHeight: 50, overflow: 'hidden' }}>{t.body.replace(/<[^>]+>/g, '').slice(0, 60)}...</div>
                  <button onClick={() => setEmailData(p => ({ ...p, subject: t.subject, body: t.body }))} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 12 }}>Use</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMTP */}
        {activeTab === 'smtp' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>SMTP Accounts</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={testAllSmtp} style={{ ...s.btn, ...s.btnWarning }}><RefreshCw size={18} /> Test All</button>
                <button onClick={() => { setNewSmtp({ name: '', host: 'smtp.office365.com', port: '587', username: '', password: '', fromName: '', fromEmail: '', enabled: true }); setEditingSmtp(null); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnPrimary }}><Plus size={18} /> Add SMTP</button>
              </div>
            </div>
            <div style={{ background: '#dbeafe', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8', marginBottom: 8 }}>Quick Presets</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{ n: 'Office 365', h: 'smtp.office365.com', p: '587' }, { n: 'Gmail', h: 'smtp.gmail.com', p: '587' }, { n: 'Outlook', h: 'smtp-mail.outlook.com', p: '587' }, { n: 'SendGrid', h: 'smtp.sendgrid.net', p: '587' }].map(pr => (
                  <button key={pr.n} onClick={() => { setNewSmtp(p => ({ ...p, name: pr.n, host: pr.h, port: pr.p })); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSecondary, ...s.btnSmall }}>{pr.n}</button>
                ))}
              </div>
            </div>
            <div>
              {smtpAccounts.map(sm => (
                <div key={sm.id} style={{ border: '2px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="checkbox" checked={sm.enabled} onChange={() => setSmtpAccounts(p => p.map(x => x.id === sm.id ? { ...x, enabled: !x.enabled } : x))} style={{ width: 20, height: 20 }} />
                    <div><h3 style={{ margin: 0, fontWeight: 600 }}>{sm.name}</h3><div style={{ fontSize: 13, color: '#6b7280' }}>{sm.host}:{sm.port}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...s.badge, background: sm.status === 'success' ? '#dcfce7' : sm.status === 'failed' ? '#fee2e2' : '#f3f4f6', color: sm.status === 'success' ? '#166534' : sm.status === 'failed' ? '#dc2626' : '#6b7280' }}>{sm.status === 'success' ? <><Wifi size={12} /> OK</> : sm.status === 'failed' ? <><WifiOff size={12} /> Fail</> : 'Untested'}</span>
                    <button onClick={() => testSmtp(sm.id)} disabled={testingSmtpId === sm.id} style={{ ...s.btn, ...s.btnSmall, ...s.btnWarning }}>{testingSmtpId === sm.id ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <TestTube size={14} />}</button>
                    <button onClick={() => { setNewSmtp({ ...sm }); setEditingSmtp(sm); setShowSmtpModal(true); }} style={{ ...s.btn, ...s.btnSmall, ...s.btnSecondary }}><Edit3 size={14} /></button>
                    <button onClick={() => smtpAccounts.length > 1 && setSmtpAccounts(p => p.filter(x => x.id !== sm.id))} style={{ ...s.btn, ...s.btnSmall, ...s.btnDanger }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div style={s.card}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Campaigns</h2>
            {campaigns.length ? campaigns.map(c => (
              <div key={c.id} style={{ border: '2px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div><h3 style={{ margin: 0 }}>{c.name}</h3><div style={{ fontSize: 13, color: '#6b7280' }}>{c.date}</div></div>
                  <span style={{ ...s.badge, background: c.status === 'completed' ? '#dcfce7' : '#fef3c7', color: c.status === 'completed' ? '#166534' : '#92400e' }}>{c.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  {[{ l: 'Total', v: c.total, c: '#6b7280' }, { l: 'Sent', v: c.sent, c: '#10b981' }, { l: 'Failed', v: c.failed, c: '#ef4444' }, { l: 'Rate', v: c.total ? Math.round(c.sent / c.total * 100) + '%' : '0%', c: '#667eea' }].map(st => (
                    <div key={st.l} style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: st.c }}>{st.v}</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{st.l}</div></div>
                  ))}
                </div>
              </div>
            )) : <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}><BarChart3 size={64} style={{ opacity: 0.5, marginBottom: 16 }} /><p>No campaigns</p></div>}
          </div>
        )}

        {/* SMTP Modal */}
        {showSmtpModal && (
          <div style={s.modal} onClick={() => setShowSmtpModal(false)}>
            <div style={s.modalContent} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingSmtp ? 'Edit' : 'Add'} SMTP</h2><button onClick={() => setShowSmtpModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Name</label><input style={s.input} placeholder="My SMTP" value={newSmtp.name} onChange={e => setNewSmtp(p => ({ ...p, name: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Host</label><input style={s.input} value={newSmtp.host} onChange={e => setNewSmtp(p => ({ ...p, host: e.target.value }))} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Port</label><input style={s.input} value={newSmtp.port} onChange={e => setNewSmtp(p => ({ ...p, port: e.target.value }))} /></div>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Username</label><input style={s.input} placeholder="email@domain.com" value={newSmtp.username} onChange={e => setNewSmtp(p => ({ ...p, username: e.target.value }))} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Password</label><input type="password" style={s.input} placeholder="••••••••" value={newSmtp.password} onChange={e => setNewSmtp(p => ({ ...p, password: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>From Name</label><input style={s.input} placeholder="Your Name" value={newSmtp.fromName} onChange={e => setNewSmtp(p => ({ ...p, fromName: e.target.value }))} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>From Email</label><input style={s.input} placeholder="from@domain.com" value={newSmtp.fromEmail} onChange={e => setNewSmtp(p => ({ ...p, fromEmail: e.target.value }))} /></div>
              </div>
              <button onClick={addSmtpAccount} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 12 }}>{editingSmtp ? 'Update' : 'Add'} SMTP</button>
            </div>
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && (
          <div style={s.modal} onClick={() => setShowTemplateModal(false)}>
            <div style={s.modalContent} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}><h2 style={{ margin: 0 }}>{editingTemplate ? 'Edit' : 'New'} Template</h2><button onClick={() => setShowTemplateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Name</label><input style={s.input} placeholder="Template name" value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Subject</label><input style={s.input} placeholder="Email subject" value={newTemplate.subject} onChange={e => setNewTemplate(p => ({ ...p, subject: e.target.value }))} /></div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>{mergeFields.map(f => (<button key={f} onClick={() => setNewTemplate(p => ({ ...p, body: p.body + f }))} style={{ ...s.btn, ...s.btnSecondary, padding: '4px 8px', fontSize: 11 }}>{f}</button>))}</div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Body</label><textarea style={{ ...s.textarea, minHeight: 150 }} placeholder="<p>Your content...</p>" value={newTemplate.body} onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))} /></div>
              <button onClick={saveTemplate} style={{ ...s.btn, ...s.btnPrimary, width: '100%', marginTop: 12 }}>{editingTemplate ? 'Update' : 'Save'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
