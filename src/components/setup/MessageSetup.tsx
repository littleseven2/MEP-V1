import React, { useState } from 'react';
import { Mail, Bell, Smartphone, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useMessageStore } from '../../store/messageStore';
import type { MessageAttributes, Channel } from '../../types/message';
import {
  consentCategories,
  messagePrograms,
  messageTypes,
} from '../../data/defaults';
import { Button, Input, Select } from '../../ui';

const channelOptions: { value: Channel; icon: React.ReactNode }[] = [
  { value: 'email', icon: <Mail size={18} /> },
  { value: 'push', icon: <Bell size={18} /> },
  { value: 'in-app', icon: <Smartphone size={18} /> },
];

export function MessageSetup() {
  const setView = useMessageStore((s) => s.setView);
  const createMessage = useMessageStore((s) => s.createMessage);

  const [channel, setChannel] = useState<Channel>('email');
  const [name, setName] = useState('');
  const [cadence, setCadence] = useState('temporal');
  const [consentCategory, setConsentCategory] = useState('');
  const [messageProgram, setMessageProgram] = useState('');
  const [messageType, setMessageType] = useState('');
  const [sendDate, setSendDate] = useState('');
  const [sendTime, setSendTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [campaign, setCampaign] = useState('');
  const [eligibility, setEligibility] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attrs: MessageAttributes = {
      name,
      channel,
      cadence: cadence as MessageAttributes['cadence'],
      consentCategory,
      messageProgram,
      messageType,
      sendDate,
      sendTime: sendTime || undefined,
      endDate: endDate || undefined,
      campaign: campaign || undefined,
      eligibility: eligibility || undefined,
    };
    createMessage(attrs);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: 12,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          margin: 12,
          padding: '16px 24px',
          background: 'var(--color-bg-secondary)',
          borderRadius: 16,
          border: '1px solid var(--color-border-default)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--color-brand) 0%, #FF6B6B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={22} color="white" />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Message Setup
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView('home')}
          style={{ marginLeft: 'auto' }}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          Back
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 580,
          margin: '0 auto',
          padding: 24,
        }}
      >
        {/* Channel selector */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--color-text-secondary)',
              marginBottom: 12,
            }}
          >
            Channel
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            {channelOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setChannel(opt.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderRadius: 12,
                  border: '1px solid',
                  borderColor: channel === opt.value ? 'var(--color-brand)' : 'var(--color-border-default)',
                  background: channel === opt.value ? 'var(--color-brand-subtle)' : 'var(--color-bg-tertiary)',
                  color: channel === opt.value ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-family)',
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
              >
                {opt.icon}
                {opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Input
            label="Message Name"
            size="lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter message name"
            fullWidth
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Select
            label="Cadence"
            options={[
              { value: 'temporal', label: 'Temporal' },
              { value: 'evergreen', label: 'Evergreen' },
            ]}
            value={cadence}
            onChange={setCadence}
          />
          <Select
            label="Consent Category"
            options={consentCategories}
            value={consentCategory}
            onChange={setConsentCategory}
          />
          <Select
            label="Message Program"
            options={messagePrograms}
            value={messageProgram}
            onChange={setMessageProgram}
          />
          <Select
            label="Message Type"
            options={messageTypes}
            value={messageType}
            onChange={setMessageType}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Input
            label="Send Date"
            type="date"
            value={sendDate}
            onChange={(e) => setSendDate(e.target.value)}
            fullWidth
          />
          <Input
            label="Send Time"
            type="time"
            value={sendTime}
            onChange={(e) => setSendTime(e.target.value)}
            fullWidth
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Input
            label="Campaign"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="Campaign name"
            fullWidth
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--color-text-secondary)',
              marginBottom: 8,
            }}
          >
            Eligibility SQL
          </label>
          <textarea
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            placeholder="SELECT ..."
            style={{
              width: '100%',
              minHeight: 120,
              padding: 12,
              borderRadius: 12,
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-primary)',
              fontFamily: 'monospace',
              fontSize: 13,
              resize: 'vertical',
            }}
          />
        </div>

        <Button type="submit" size="lg">
          Continue to Builder
          <ArrowRight size={18} style={{ marginLeft: 8 }} />
        </Button>
      </form>
    </div>
  );
}
