import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. Submit Membership Application with screenshot & UTR
export const submitMembershipApplication = createAsyncThunk(
  'applications/submitMembershipApplication',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/members/apply', formData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Submission failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error submitting membership application');
    }
  }
);

// 2. Submit Volunteer Application
export const submitVolunteerApplication = createAsyncThunk(
  'applications/submitVolunteerApplication',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/volunteers/apply', formData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Submission failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error submitting volunteer application');
    }
  }
);

// 3. Admin: Fetch Member Applications
export const fetchMemberApplications = createAsyncThunk(
  'applications/fetchMemberApplications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/applications/members');
      if (res.data.success) {
        return res.data.applications;
      }
      return rejectWithValue('Failed to load applications');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error loading applications');
    }
  }
);

// 4. Admin: Fetch Volunteer Applications
export const fetchVolunteerApplications = createAsyncThunk(
  'applications/fetchVolunteerApplications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/applications/volunteers');
      if (res.data.success) {
        return res.data.applications;
      }
      return rejectWithValue('Failed to load volunteer applications');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error loading volunteer applications');
    }
  }
);

// 5. Admin: Approve Membership Application (Unlocks ID card, Appointment Letter, sends email)
export const approveMembershipApplication = createAsyncThunk(
  'applications/approveMembershipApplication',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/members/${id}/approve`);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Approval failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error approving application');
    }
  }
);

// 6. Admin: Reject Membership Application
export const rejectMembershipApplication = createAsyncThunk(
  'applications/rejectMembershipApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/members/${id}/reject`, { reason });
      if (res.data.success) {
        return res.data.application;
      }
      return rejectWithValue(res.data.message || 'Rejection failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error rejecting application');
    }
  }
);

// 7. Admin: Approve Volunteer Application (Sends welcome email & unlocks offer letter)
export const approveVolunteerApplication = createAsyncThunk(
  'applications/approveVolunteerApplication',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/volunteers/${id}/approve`);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Volunteer approval failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error approving volunteer');
    }
  }
);

// 8. Admin: Reject Volunteer Application
export const rejectVolunteerApplication = createAsyncThunk(
  'applications/rejectVolunteerApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/volunteers/${id}/reject`, { reason });
      if (res.data.success) {
        return res.data.application;
      }
      return rejectWithValue(res.data.message || 'Rejection failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error rejecting volunteer');
    }
  }
);

// 9. Submit Coordinator Application
export const submitCoordinatorApplication = createAsyncThunk(
  'applications/submitCoordinatorApplication',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/coordinators/apply', formData);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Submission failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error submitting coordinator application');
    }
  }
);

// 10. Admin: Fetch Coordinator Applications
export const fetchCoordinatorApplications = createAsyncThunk(
  'applications/fetchCoordinatorApplications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/applications/coordinators');
      if (res.data.success) {
        return res.data.applications;
      }
      return rejectWithValue('Failed to load coordinator applications');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error loading coordinator applications');
    }
  }
);

// 11. Admin: Approve Coordinator Application
export const approveCoordinatorApplication = createAsyncThunk(
  'applications/approveCoordinatorApplication',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/coordinators/${id}/approve`);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Coordinator approval failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error approving coordinator');
    }
  }
);

// 12. Admin: Reject Coordinator Application
export const rejectCoordinatorApplication = createAsyncThunk(
  'applications/rejectCoordinatorApplication',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/coordinators/${id}/reject`, { reason });
      if (res.data.success) {
        return res.data.application;
      }
      return rejectWithValue(res.data.message || 'Rejection failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error rejecting coordinator');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    memberApplications: [],
    volunteerApplications: [],
    coordinatorApplications: [],
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearAppStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Member Applications
      .addCase(fetchMemberApplications.fulfilled, (state, action) => {
        state.memberApplications = action.payload;
      })
      // Fetch Volunteer Applications
      .addCase(fetchVolunteerApplications.fulfilled, (state, action) => {
        state.volunteerApplications = action.payload;
      })
      // Submit Member Application
      .addCase(submitMembershipApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMembershipApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Application submitted for verification!';
        if (action.payload.application) {
          state.memberApplications.unshift(action.payload.application);
        }
      })
      .addCase(submitMembershipApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Volunteer Application
      .addCase(submitVolunteerApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitVolunteerApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Volunteer application submitted!';
        if (action.payload.application) {
          state.volunteerApplications.unshift(action.payload.application);
        }
      })
      .addCase(submitVolunteerApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Member Application
      .addCase(approveMembershipApplication.fulfilled, (state, action) => {
        const app = action.payload.application;
        const index = state.memberApplications.findIndex(a => a._id === app._id);
        if (index !== -1) {
          state.memberApplications[index] = app;
        }
        state.successMessage = action.payload.message;
      })
      // Reject Member Application
      .addCase(rejectMembershipApplication.fulfilled, (state, action) => {
        const index = state.memberApplications.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.memberApplications[index] = action.payload;
        }
      })
      // Approve Volunteer Application
      .addCase(approveVolunteerApplication.fulfilled, (state, action) => {
        const app = action.payload.application;
        const index = state.volunteerApplications.findIndex(a => a._id === app._id);
        if (index !== -1) {
          state.volunteerApplications[index] = app;
        }
        state.successMessage = action.payload.message;
      })
      // Reject Volunteer Application
      .addCase(rejectVolunteerApplication.fulfilled, (state, action) => {
        const index = state.volunteerApplications.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.volunteerApplications[index] = action.payload;
        }
      })
      // Fetch Coordinator Applications
      .addCase(fetchCoordinatorApplications.fulfilled, (state, action) => {
        state.coordinatorApplications = action.payload;
      })
      // Submit Coordinator Application
      .addCase(submitCoordinatorApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCoordinatorApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Coordinator application submitted!';
        if (action.payload.application) {
          state.coordinatorApplications.unshift(action.payload.application);
        }
      })
      .addCase(submitCoordinatorApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Coordinator Application
      .addCase(approveCoordinatorApplication.fulfilled, (state, action) => {
        const app = action.payload.application;
        const index = state.coordinatorApplications.findIndex(a => a._id === app._id);
        if (index !== -1) {
          state.coordinatorApplications[index] = app;
        }
        state.successMessage = action.payload.message;
      })
      // Reject Coordinator Application
      .addCase(rejectCoordinatorApplication.fulfilled, (state, action) => {
        const index = state.coordinatorApplications.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.coordinatorApplications[index] = action.payload;
        }
      });
  }
});

export const { clearAppStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
