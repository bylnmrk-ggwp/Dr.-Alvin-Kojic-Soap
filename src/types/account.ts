export interface Profile {
  id: string
  email: string
  fullName: string
  phone: string | null
  /** Resellers see wholesale pricing cues and their distributor status. */
  isDistributor: boolean
  createdAt: string
}

export type DistributorApplicationStatus = 'received' | 'reviewing' | 'approved' | 'declined'

export interface DistributorApplication {
  id: string
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  sellingExperience: string
  message: string
  status: DistributorApplicationStatus
  submittedAt: string
}
