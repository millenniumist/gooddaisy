const initializeLiff = async () => {
    const liff = (await import('@line/liff')).default;
    try {
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID
      });
      
      if (!liff.isLoggedIn()) {
        liff.login();
      }
      
      return liff;
    } catch (error) {
      console.error('LIFF initialization failed', error);
      throw error;
    }
  };
  
  const getLiffProfile = async () => {
    const liff = (await import('@line/liff')).default;
    try {
      const profile = await liff.getProfile();
      return profile;
    } catch (error) {
      console.error('Failed to get LIFF profile', error);
      throw error;
    }
  };
  
  export const liffService = {
    initializeLiff,
    getLiffProfile
  };
  