// src/utils/zammadDataMapper.ts
import { PBXCall, PBXExtension, ZammadUser } from '@/services/zammadPbxService';

// UI Types
export interface IContact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  company?: string;
  avatar?: string;
  favorite: boolean;
  tags?: string[];
  lastCallDate?: string;
}

export interface ICallHistory {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  direction: "incoming" | "outgoing";
  status: "answered" | "missed" | "voicemail" | "rejected";
  startTime: string;
  duration?: number; // in seconds
  notes?: string;
  recorded: boolean;
}

export interface IActiveCall {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  direction: "incoming" | "outgoing";
  status: "ringing" | "connecting" | "active" | "on-hold" | "transferring";
  startTime: string;
  duration: number; // in seconds
  muted: boolean;
  onHold: boolean;
}

export interface IVoicemail {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  date: string;
  duration: number; // in seconds
  listened: boolean;
  transcription?: string;
}

// Mapper functions to convert between API and UI types
export class ZammadDataMapper {
  // Map Zammad users to UI contacts
  static mapToContacts(users: ZammadUser[]): IContact[] {
    return users.map(user => ({
      id: user.id.toString(),
      name: `${user.firstname} ${user.lastname}`,
      phoneNumber: user.phone || '',
      email: user.email,
      avatar: user.avatar,
      favorite: false, // We'll need to store this locally
      tags: []
    }));
  }
  
  // Map Zammad calls to UI call history
  static mapToCallHistory(calls: PBXCall[]): ICallHistory[] {
    return calls.map(call => ({
      id: call.id,
      phoneNumber: call.direction === 'in' ? call.caller : call.recipient,
      contactName: call.direction === 'in' ? 
        call.caller_pretty : call.recipient_pretty,
      direction: call.direction === 'in' ? "incoming" : "outgoing",
      status: this.mapCallStatus(call.status),
      startTime: call.timestamp,
      duration: call.duration,
      notes: call.note,
      recorded: !!call.recording,
    }));
  }
  
  // Map Zammad call to UI active call
  static mapToActiveCall(call: PBXCall): IActiveCall {
    return {
      id: call.id,
      phoneNumber: call.direction === 'in' ? call.caller : call.recipient,
      contactName: call.direction === 'in' ? 
        call.caller_pretty : call.recipient_pretty,
      direction: call.direction === 'in' ? "incoming" : "outgoing",
      status: "active", // Default to active
      startTime: call.timestamp,
      duration: call.duration || 0,
      muted: false, // These are local UI states
      onHold: false
    };
  }
  
  // Map Zammad API call status to UI call status
  private static mapCallStatus(status: string): "answered" | "missed" | "voicemail" | "rejected" {
    switch (status) {
      case 'completed':
        return "answered";
      case 'missed':
        return "missed";
      case 'queued':
        return "voicemail"; // Best approximation
      default:
        return "answered";
    }
  }
  
  // Extract voicemails from calls
  static extractVoicemails(calls: PBXCall[]): IVoicemail[] {
    // Filter for likely voicemail calls (queued or missed with recording)
    return calls
      .filter(call => call.status === 'queued' || (call.status === 'missed' && call.recording))
      .map(call => ({
        id: `vm_${call.id}`,
        phoneNumber: call.caller,
        contactName: call.caller_pretty,
        date: call.timestamp,
        duration: call.duration || 30, // Default 30 seconds if not specified
        listened: false, // We need to track this locally
        transcription: call.note
      }));
  }
  
  // Map extensions to simplified contacts (for dialing)
  static mapExtensionsToContacts(extensions: PBXExtension[]): IContact[] {
    return extensions.map(ext => ({
      id: ext.id,
      name: ext.name,
      phoneNumber: ext.number,
      favorite: ext.status === 'available', // Make available ones favorites for easy access
      tags: [ext.status] // Use status as a tag
    }));
  }
}