export interface SongSuggestion {
  title: string
  url?: string
}

export interface Guest {
  id: string
  name: string
  pases: number
  confirmed?: boolean
  attending?: boolean
  attendees?: number
  attendeeNames?: string[]
  songs?: SongSuggestion[]
}

export interface RsvpPayload {
  id: string
  attending: boolean
  attendees: number
  attendeeNames?: string[]
  songs?: SongSuggestion[]
}
