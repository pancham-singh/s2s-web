export default (invitedAs: 'student' | 'teacher' | 'centerIncharge'): string => {
  switch (invitedAs) {
    case 'student':
      return 'Student';
    case 'teacher':
      return 'Teacher';
    case 'centerIncharge':
      return 'Center Incharge';
  }
};
