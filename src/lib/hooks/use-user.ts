import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateProfile, saveProfileToServer } from '../store/user-slice';

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.user);

  const updateUser = (data: Partial<typeof profile>) => {
    // Optimistic update
    dispatch(updateProfile(data));
    // Backend sync
    dispatch(saveProfileToServer(data));
  };

  return {
    user: profile,
    loading,
    error,
    updateUser,
  };
};
