import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, clearSession } from '../features/auth/authSlice';
import { tokenManager } from '../lib/tokenManager';
import { useRefreshMutation } from '../features/auth/authApi';
import { userApi } from '../features/users/userApi';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      if (tokenManager.getToken()) {
        if (mounted) {
          setBootstrapping(false);
        }
        return;
      }

      try {
        const result = await refresh().unwrap();
        if (mounted && result.accessToken) {
          tokenManager.setToken(result.accessToken);
          dispatch(setAccessToken(result.accessToken));
          const meRequest = dispatch(userApi.endpoints.getMe.initiate());
          await meRequest.unwrap();
          meRequest.unsubscribe();
        }
      } catch {
        if (mounted) {
          dispatch(clearSession());
        }
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch, refresh]);

  if (bootstrapping) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-neutral-400 sm:px-6 lg:px-8">
        Authenticating...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
