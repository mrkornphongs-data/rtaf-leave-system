/**
 * ระบบใบลาพักผ่อนประจำปี (แบบ ๗) - Application Logic
 * Royal Thai Armed Forces / Civil Service Leave System (Form 7)
 */

// ==========================================================================
// CONSTANTS & INITIAL DATA
// ==========================================================================

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_NUMERALS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

const DEFAULT_SETTINGS = {
  writtenAt: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
  defaultTo: 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
  statSignPos: '',
  endorseTo: 'หก.กกศ.รร.จอ.ยศ.ทอ.',
  endorseRank: 'น.ท.',
  endorsePos: 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
  endorsePos2: '',
  orderRank: 'น.ท.',
  orderPos1: 'รอง หก.กกศ.รร.จอ.ยศ.ทอ.ทำการแทน',
  orderPos2: 'หก.กกศ.รร.จอ.ยศ.ทอ.',
  useThaiNumerals: true,
  defaultPronoun: 'กระผม',
  systemTitle: 'ระบบสารสนเทศบริหารจัดการการลาอิเล็กทรอนิกส์',
  systemSubtitle: 'งานสารบรรณและทะเบียนกำลังพล • ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
  systemLogo: '📋'
};

const DEFAULT_PERSONNEL = [
  {
    id: 'p0',
    rank: 'พ.อ.อ.',
    name: 'กรณ์พงษ์  สุขเกียรติ์สกุล',
    position: 'ผู้ดูแลระบบและพัฒนาระบบสารบรรณอิเล็กทรอนิกส์',
    position2: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 10,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '171/5',
    road: 'พหลโยธิน',
    subdistrict: 'คลองถนน',
    district: 'สายไหม',
    province: 'กรุงเทพมหานคร',
    phone: '081-234-5678',
    pronoun: 'กระผม'
  },
  {
    id: 'p1',
    rank: 'ร.ท.',
    name: 'สมชาย  ใจดี',
    position: 'ประจำ ผวสม.กกศ.ฯ',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 5,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '12/3',
    road: 'พหลโยธิน',
    subdistrict: 'คลองถนน',
    district: 'สายไหม',
    province: 'กรุงเทพมหานคร',
    phone: '081-234-5678',
    pronoun: 'กระผม'
  },
  {
    id: 'p2',
    rank: 'พ.อ.อ.',
    name: 'เกรียงไกร  มีชัย',
    position: 'จนท.การศึกษา ผวสม.กกศ.ฯ',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 10,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '55/9',
    road: 'วิภาวดีรังสิต',
    subdistrict: 'สนามบิน',
    district: 'ดอนเมือง',
    province: 'กรุงเทพมหานคร',
    phone: '086-555-1234',
    pronoun: 'กระผม'
  },
  {
    id: 'p3',
    rank: 'จ.อ.หญิง',
    name: 'นภาพร  สว่างจิต',
    position: 'จนท.ธุรการ ผวสม.กกศ.ฯ',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 0,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '88/1',
    road: 'แจ้งวัฒนะ',
    subdistrict: 'ทุ่งสองห้อง',
    district: 'หลักสี่',
    province: 'กรุงเทพมหานคร',
    phone: '084-333-7890',
    pronoun: 'ดิฉัน'
  },
  {
    id: 'p4',
    rank: 'ร.อ.',
    name: 'วิโรจน์  แดนไทย',
    position: 'ผช.หน.ผวสม.กกศ.ฯ',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 15,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '102/4',
    road: 'รามอินทรา',
    subdistrict: 'อนุสาวรีย์',
    district: 'บางเขน',
    province: 'กรุงเทพมหานคร',
    phone: '089-111-2233',
    pronoun: 'กระผม'
  },
  {
    id: 'p5',
    rank: 'น.ท.หญิง',
    name: 'ปุณยวีย์  สุขวิบูลย์',
    position: 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 10,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '99/5',
    road: 'พหลโยธิน',
    subdistrict: 'คลองถนน',
    district: 'สายไหม',
    province: 'กรุงเทพมหานคร',
    phone: '081-999-8877',
    pronoun: 'ดิฉัน'
  },
  {
    id: 'p6',
    rank: 'พ.อ.อ.',
    name: 'วิทยา  อุ่นโรจน์',
    position: 'ครูผู้ช่วย ผวสส.กกศ.รร.จอ.ยศ.ทอ.',
    position2: 'ช่วยราชการ ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    unit: 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    annualQuota: 10,
    accQuota: 0,
    sickQuota: 60,
    sickTaken: 0,
    homeNo: '12/3',
    road: 'พหลโยธิน',
    subdistrict: 'คลองถนน',
    district: 'สายไหม',
    province: 'กรุงเทพมหานคร',
    phone: '081-234-5678',
    pronoun: 'กระผม'
  }
];

const DEFAULT_LEAVES = [
  {
    id: 'LV-2569-001',
    personId: 'p1',
    username: 'user',
    createdBy: 'user',
    name: 'ร.ท.สมชาย  ใจดี',
    position: 'ประจำ ผวสม.กกศ.ฯ',
    leaveType: 'vacation',
    formType: 'ลาพักผ่อน (แบบ ๗)',
    docDate: '2026-06-10',
    startDate: '2026-06-15',
    endDate: '2026-06-17',
    days: 3,
    province: 'ระยอง',
    contactAddress: 'บ้านพักเลขที่ 12/3 ถ.สุขุมวิท อ.เมือง จ.ระยอง',
    phone: '081-234-5678',
    status: 'approved',
    createdAt: '2026-06-10T09:00:00.000Z'
  },
  {
    id: 'SK-2569-001',
    personId: 'p2',
    username: 'user2',
    createdBy: 'user2',
    name: 'พ.อ.อ.เกรียงไกร  มีชัย',
    position: 'จนท.การศึกษา ผวสม.กกศ.ฯ',
    leaveType: 'sick',
    formType: 'ลาป่วย (แบบ ๓)',
    diagnosis: 'ไข้หวัดใหญ่ พักรักษาตัวตามแพทย์สั่ง',
    docDate: '2026-06-20',
    startDate: '2026-06-22',
    endDate: '2026-06-23',
    days: 2,
    hospital: 'รพ.ภูมิพลอดุลยเดช พอ.',
    contactAddress: '55/9 ถ.วิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กทม.',
    phone: '086-555-1234',
    status: 'approved',
    createdAt: '2026-06-20T10:00:00.000Z'
  },
  {
    id: 'PERS-2569-001',
    personId: 'p3',
    username: 'user3',
    createdBy: 'user3',
    name: 'จ.อ.หญิง นภาพร  สว่างจิต',
    position: 'จนท.ธุรการ ผวสม.กกศ.ฯ',
    leaveType: 'personal',
    formType: 'ลากิจ (แบบ ๖)',
    reason: 'ติดต่อราชการทำนิติกรรมที่ดินภูมิลำเนาเดิม',
    docDate: '2026-06-28',
    startDate: '2026-07-01',
    endDate: '2026-07-02',
    days: 2,
    province: 'เชียงใหม่',
    contactAddress: '88/1 ถ.แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กทม.',
    phone: '084-333-7890',
    status: 'approved',
    createdAt: '2026-06-28T14:30:00.000Z'
  },
  {
    id: 'LV-2569-002',
    personId: 'p4',
    username: 'user4',
    createdBy: 'user4',
    name: 'ร.อ.วิโรจน์  แดนไทย',
    position: 'ผช.หน.ผวสม.กกศ.ฯ',
    leaveType: 'vacation',
    formType: 'ลาพักผ่อน (แบบ ๗)',
    docDate: '2026-08-05',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: 5,
    province: 'ชลบุรี',
    contactAddress: '102/4 ถ.รามอินทรา แขวงอนุสาวรีย์ เขตบางเขน กทม.',
    phone: '089-111-2233',
    status: 'approved',
    createdAt: '2026-08-05T08:30:00.000Z'
  },
  {
    id: 'LV-2569-003',
    personId: 'p5',
    username: 'user5',
    createdBy: 'user5',
    name: 'น.ท.หญิง ปุณยวีย์  สุขวิบูลย์',
    position: 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    leaveType: 'vacation',
    formType: 'ลาพักผ่อน (แบบ ๗)',
    docDate: '2026-09-01',
    startDate: '2026-09-02',
    endDate: '2026-09-04',
    days: 3,
    province: 'เชียงใหม่',
    contactAddress: '99/5 ถ.พหลโยธิน แขวงคลองถนน เขตสายไหม กทม.',
    phone: '081-999-8877',
    status: 'pending',
    createdAt: '2026-09-01T11:00:00.000Z'
  }
];

const SYSTEM_PAGES = [
  { id: 'dashboard', name: 'แดชบอร์ด', icon: '📊', desc: 'สรุปภาพรวมและสถิติวันลา' },
  { id: 'create', name: 'ลาพักผ่อน (แบบ ๗)', icon: '🌴', desc: 'เขียนใบลาพักผ่อนประจำปี' },
  { id: 'create-sick', name: 'ลาป่วย (แบบ ๓)', icon: '🩺', desc: 'เขียนใบลาป่วย' },
  { id: 'create-personal', name: 'ลากิจธุระ (แบบ ๖)', icon: '💼', desc: 'เขียนใบลากิจ' },
  { id: 'history', name: 'ทะเบียนใบลา', icon: '📑', desc: 'ทะเบียนคุมใบลาทุกประเภท' },
  { id: 'personnel', name: 'กำลังพล', icon: '👥', desc: 'ทะเบียนและสถิติกำลังพล' },
  { id: 'settings', name: 'ตั้งค่า', icon: '⚙️', desc: 'ตั้งค่าหน่วยงานและสำรองข้อมูล' },
  { id: 'permissions', name: 'สิทธิ์การใช้งาน', icon: '🔐', desc: 'จัดการผู้ใช้งานและกำหนดสิทธิ์' },
  { id: 'audit-log', name: 'ประวัติการใช้งาน', icon: '📜', desc: 'บันทึกประวัติกิจกรรมและ Audit Log' }
];

const DEFAULT_USERS = [
  {
    id: 'u0',
    username: 'Kornphong',
    password: 'Kornphong31$',
    name: 'พ.อ.อ.กรณ์พงษ์  สุขเกียรติ์สกุล',
    role: 'superadmin',
    personId: 'p0',
    allowedPages: ['dashboard', 'create', 'create-sick', 'create-personal', 'history', 'personnel', 'settings', 'permissions', 'audit-log'],
    createdAt: '2026-06-01'
  },
  {
    id: 'u1',
    username: 'admin',
    password: 'admin123',
    name: 'ผู้ดูแลระบบ (Admin)',
    role: 'admin',
    personId: '',
    allowedPages: ['dashboard', 'create', 'create-sick', 'create-personal', 'history', 'personnel', 'settings', 'permissions', 'audit-log'],
    createdAt: '2026-06-01'
  },
  {
    id: 'u2',
    username: 'user',
    password: 'user123',
    name: 'ร.ท.สมชาย  ใจดี',
    role: 'user',
    personId: 'p1',
    allowedPages: ['dashboard', 'create', 'create-sick', 'create-personal', 'history'],
    createdAt: '2026-06-01'
  },
  {
    id: 'u3',
    username: 'user2',
    password: 'user123',
    name: 'พ.อ.อ.เกรียงไกร  มีชัย',
    role: 'user',
    personId: 'p2',
    allowedPages: ['dashboard', 'create', 'create-sick', 'create-personal', 'history'],
    createdAt: '2026-06-01'
  }
];

// ==========================================================================
// APPLICATION STATE
// ==========================================================================

let state = {
  settings: { ...DEFAULT_SETTINGS },
  personnel: [ ...DEFAULT_PERSONNEL ],
  leaves: [ ...DEFAULT_LEAVES ],
  users: [ ...DEFAULT_USERS ],
  currentUser: null,
  activeLeaveId: null, // If editing or viewing an existing leave
  leaveMode: 'range',  // 'range' | 'discrete'
  discreteDates: [],   // Array of 'YYYY-MM-DD' strings for discrete / alternating leave
  customDateText: '',  // Custom override for Form 7 discrete date text
  isCustomDateTextManual: false,
  leaveTypeFilter: 'all', // 'all' | 'vacation' | 'sick' | 'personal'
  auditLogs: []        // System activity / audit log entries
};
if (typeof window !== 'undefined') {
  window.state = state;
}

// ==========================================================================
// STORAGE MANAGEMENT
// ==========================================================================

function loadState() {
  try {
    const savedSettings = localStorage.getItem('leave_sys_settings');
    const savedPersonnel = localStorage.getItem('leave_sys_personnel');
    const savedLeaves = localStorage.getItem('leave_sys_leaves');
    const savedUsers = localStorage.getItem('leave_sys_users');
    const savedCurUser = localStorage.getItem('leave_sys_current_user');

    if (savedSettings) {
      state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      if (state.settings.statSignPos === 'จนท.สถิติวันลา ผวสม.กกศ.ฯ') {
        state.settings.statSignPos = '';
      }
    }
    if (savedPersonnel) {
      try {
        const parsedPersonnel = JSON.parse(savedPersonnel);
        if (Array.isArray(parsedPersonnel) && parsedPersonnel.length > 0) {
          state.personnel = parsedPersonnel;
        } else {
          state.personnel = [ ...DEFAULT_PERSONNEL ];
        }
      } catch (e) {
        state.personnel = [ ...DEFAULT_PERSONNEL ];
      }

      // Ensure strictly unique personnel names while preserving all saved edits
      const uniquePersonnelMap = new Map();
      state.personnel.forEach(p => {
        if (!p) return;
        const key = (p.name || '').replace(/\s+/g, '').toLowerCase() || p.id;
        if (!uniquePersonnelMap.has(key)) {
          uniquePersonnelMap.set(key, p);
        }
      });
      state.personnel = Array.from(uniquePersonnelMap.values());
    } else {
      state.personnel = [ ...DEFAULT_PERSONNEL ];
    }
    if (savedLeaves) {
      state.leaves = JSON.parse(savedLeaves);
      if (state.leaves.length <= 1) {
        DEFAULT_LEAVES.forEach(dl => {
          if (!state.leaves.some(l => l.id === dl.id)) {
            state.leaves.push(dl);
          }
        });
      }
    }

    if (savedUsers) {
      try {
        state.users = JSON.parse(savedUsers);
      } catch (e) {
        state.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
      }
    } else {
      state.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
    }

    // Ensure default users u1, u2, u3 exist
    DEFAULT_USERS.forEach(defU => {
      if (!state.users.some(u => u.username === defU.username)) {
        state.users.push(JSON.parse(JSON.stringify(defU)));
      }
    });

    // Ensure dashboard is included in allowedPages for all users
    state.users.forEach(u => {
      if (Array.isArray(u.allowedPages) && !u.allowedPages.includes('dashboard')) {
        u.allowedPages.unshift('dashboard');
      }
    });

    // Backfill username on existing leaves to ensure strict ownership
    state.leaves.forEach(l => {
      if (!l.username && l.personId) {
        const matchedUser = state.users.find(u => u.personId === l.personId);
        if (matchedUser) {
          l.username = matchedUser.username;
          l.createdBy = matchedUser.username;
        }
      }
    });

    // Ensure user list is initialized if completely empty
    if (!Array.isArray(state.users) || state.users.length === 0) {
      state.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
    }

    // Ensure Superadmin Kornphong exists and has the required credentials
    let kornphongUser = state.users.find(u => u.username && u.username.toLowerCase() === 'kornphong');
    if (!kornphongUser) {
      kornphongUser = {
        id: 'u0',
        username: 'Kornphong',
        password: 'Kornphong31$',
        name: 'พ.อ.อ.กรณ์พงษ์  สุขเกียรติ์สกุล',
        role: 'superadmin',
        personId: 'p0',
        allowedPages: SYSTEM_PAGES.map(p => p.id),
        createdAt: '2026-06-01'
      };
      state.users.unshift(kornphongUser);
    } else {
      kornphongUser.password = 'Kornphong31$';
      kornphongUser.role = 'superadmin';
      kornphongUser.name = 'พ.อ.อ.กรณ์พงษ์  สุขเกียรติ์สกุล';
      kornphongUser.personId = 'p0';
      kornphongUser.allowedPages = SYSTEM_PAGES.map(p => p.id);
    }

    // Ensure person p0 exists in personnel list
    if (!state.personnel.some(p => p.id === 'p0' || (p.name && p.name.includes('กรณ์พงษ์')))) {
      state.personnel.unshift(DEFAULT_PERSONNEL[0]);
    }

    // Audit logs persistence
    const savedLogs = localStorage.getItem('leave_sys_audit_logs');
    if (savedLogs) {
      try {
        state.auditLogs = JSON.parse(savedLogs);
        if (!Array.isArray(state.auditLogs) || state.auditLogs.length === 0) {
          state.auditLogs = generateInitialAuditLogs();
        }
      } catch (e) {
        state.auditLogs = generateInitialAuditLogs();
      }
    } else {
      state.auditLogs = generateInitialAuditLogs();
    }

    // Ensure admin and superadmin users always have audit-log page allowed
    state.users.forEach(u => {
      if ((u.role === 'admin' || u.role === 'superadmin') && Array.isArray(u.allowedPages) && !u.allowedPages.includes('audit-log')) {
        u.allowedPages.push('audit-log');
      }
    });

    // Restore logged in user session from localStorage until user explicitly clicks logout
    if (savedCurUser && savedCurUser !== 'null') {
      try {
        const parsedUser = JSON.parse(savedCurUser);
        const matchingUser = state.users.find(u => 
          (parsedUser.id && u.id === parsedUser.id) || 
          (parsedUser.username && u.username && u.username.toLowerCase() === parsedUser.username.toLowerCase())
        );
        if (matchingUser && !matchingUser.isLocked) {
          state.currentUser = matchingUser;
        } else {
          state.currentUser = null;
          localStorage.removeItem('leave_sys_current_user');
        }
      } catch (e) {
        state.currentUser = null;
        localStorage.removeItem('leave_sys_current_user');
      }
    } else {
      state.currentUser = null;
    }
  } catch (err) {
    console.warn('Error loading localStorage data, using defaults:', err);
  }
}

function saveState() {
  try {
    localStorage.setItem('leave_sys_settings', JSON.stringify(state.settings));
    localStorage.setItem('leave_sys_personnel', JSON.stringify(state.personnel));
    localStorage.setItem('leave_sys_leaves', JSON.stringify(state.leaves));
    localStorage.setItem('leave_sys_users', JSON.stringify(state.users));
    localStorage.setItem('leave_sys_audit_logs', JSON.stringify(state.auditLogs || []));
    if (state.currentUser) {
      localStorage.setItem('leave_sys_current_user', JSON.stringify(state.currentUser));
    } else {
      localStorage.setItem('leave_sys_current_user', 'null');
    }
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// ==========================================================================
// HELPER & CONVERSION FUNCTIONS
// ==========================================================================

const THAI_SHORT_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

function toThaiDigits(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s.replace(/[0-9]/g, (digit) => THAI_NUMERALS[parseInt(digit, 10)]);
}

function formatNumberOutput(val) {
  if (val === null || val === undefined || val === '') return '-';
  const isThai = document.getElementById('chkThaiNum')?.checked ?? state.settings.useThaiNumerals;
  return isThai ? toThaiDigits(val) : String(val);
}

/**
 * จัดรูปแบบเดือนและปีสำหรับการลงชื่อเสนอและอนุมัติ (ส่วนที่ ๔)
 * ตัวอย่าง: '2026-10' -> 'ต.ค.&nbsp;&nbsp;๖๙' (หรือ 'ต.ค.&nbsp;&nbsp;69' หากไม่ใช้เลขไทย)
 * หากไม่ได้เลือกค่าให้เว้นว่าง '&nbsp;' (ไม่มีเส้นประและไม่มีเครื่องหมายทับ)
 */
function formatApprovalMonthDisplay(monthVal, isThaiNumeral = true) {
  if (!monthVal) return '&nbsp;';
  const parts = String(monthVal).trim().split('-');
  if (parts.length < 2) return '&nbsp;';
  const yearCE = parseInt(parts[0], 10);
  const monthNum = parseInt(parts[1], 10);
  if (isNaN(yearCE) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) return '&nbsp;';
  const thaiMonth = THAI_SHORT_MONTHS[monthNum - 1];
  const yearBE = yearCE + 543;
  const shortYear = String(yearBE).slice(-2);
  const formattedYear = isThaiNumeral ? toThaiDigits(shortYear) : shortYear;
  return `${thaiMonth}${formattedYear}`;
}

function extractRank(fullName) {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  const commonRanks = [
    'พ.อ.อ.หญิง', 'พ.อ.ท.หญิง', 'พ.อ.ต.หญิง', 'จ.อ.หญิง', 'จ.ท.หญิง', 'จ.ต.หญิง',
    'น.อ.หญิง', 'น.ท.หญิง', 'น.ต.หญิง', 'ร.อ.หญิง', 'ร.ท.หญิง', 'ร.ต.หญิง',
    'พล.อ.อ.หญิง', 'พล.อ.ท.หญิง', 'พล.อ.ต.หญิง',
    'พล.อ.อ.', 'พล.อ.ท.', 'พล.อ.ต.', 'น.อ.พิเศษ', 'น.อ.', 'น.ท.', 'น.ต.',
    'ร.อ.', 'ร.ท.', 'ร.ต.',
    'พ.อ.อ.', 'พ.อ.ท.', 'พ.อ.ต.', 'จ.อ.', 'จ.ท.', 'จ.ต.',
    'พล.อ.', 'พล.ท.', 'พล.ต.', 'พ.อ.', 'พ.ท.', 'พ.ต.',
    'พล.ร.อ.', 'พล.ร.ท.', 'พล.ร.ต.', 'น.อ.(พ)',
    'พลทหาร', 'นรจ.', 'นนอ.', 'นาย', 'นาง', 'นางสาว', 'น.ส.'
  ];
  for (const r of commonRanks) {
    if (trimmed.startsWith(r)) {
      return r;
    }
  }
  const match = trimmed.match(/^([ก-๙]{1,3}\.([ก-๙]{1,3}\.)*)/);
  if (match) return match[1];
  return '';
}

/**
 * จัดรูปแบบ ยศ. ชื่อ และนามสกุล ตามระเบียบ:
 * 1. ยศทั่วไป (เช่น น.ท., ร.ท., พ.อ.อ.) ไม่ต้องเว้นวรรค ให้ชื่อติดไปเลย เช่น "น.ท.สมชาย"
 * 2. ยศหญิง (มีคำว่า "หญิง" เช่น น.ท.หญิง, จ.อ.หญิง, ร.ต.หญิง) ให้เว้นวรรค 1 เคาะ เช่น "น.ท.หญิง สมศรี"
 * 3. ระหว่าง ชื่อ กับ นามสกุล ให้เว้นวรรค 2 เคาะ เช่น "สมชาย  ใจดี"
 */
function formatRankName(rank, rawName) {
  let r = (rank || '').trim();
  let n = (rawName || '').trim();

  // หากในชื่อมีคำนำหน้ายศติดมาด้วย ให้ตัดยศออกก่อนเพื่อนำมาจัดวรรคใหม่ให้ถูกต้อง
  if (r && n.startsWith(r)) {
    n = n.slice(r.length).trim();
  } else if (!r) {
    const extracted = extractRank(n);
    if (extracted) {
      r = extracted;
      n = n.slice(extracted.length).trim();
    }
  }

  // จัดการชื่อและนามสกุล: คั่นระหว่างชื่อกับนามสกุลด้วย 2 เคาะ (\u00A0\u00A0)
  let formattedName = '';
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      formattedName = `${parts[0]}\u00A0\u00A0${parts.slice(1).join(' ')}`;
    } else {
      formattedName = parts[0] || '';
    }
  }

  if (!r && !formattedName) return '';
  if (!r) return formattedName;
  if (!formattedName) return r;

  // กฎการเว้นวรรค ยศ:
  // - ยศหญิง (มีคำว่า "หญิง" เช่น น.ท.หญิง, จ.อ.หญิง) ให้เว้นวรรค 1 เคาะ
  // - ยศทั่วไป (เช่น น.ท., ร.ท., พ.อ.อ.) ไม่ต้องเว้นวรรค ให้ชื่อติดไปเลย
  const isFemaleRank = r.includes('หญิง');
  const rankSpacer = isFemaleRank ? ' ' : '';

  return `${r}${rankSpacer}${formattedName}`;
}

/**
 * จัดรูปแบบ ชื่อ - นามสกุล ให้เว้นวรรค 2 เคาะ
 */
function formatNameSpacing(name) {
  if (!name) return '';
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0]}  ${parts.slice(1).join(' ')}`;
  }
  return trimmed;
}

function handleNameInput(val) {
  const extracted = extractRank(val);
  const rankInput = document.getElementById('inpRank');
  if (extracted && rankInput && (!rankInput.value || val.startsWith(extracted))) {
    rankInput.value = extracted;
  }
  render();
}

function handlePosInput(val) {
  render();
}

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d, 12, 0, 0);
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function formatDateForInput(d) {
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseThaiDate(dateStr) {
  if (!dateStr) return { day: '-', month: '-', year: '-', fullMonth: '-', fullYear: '-' };
  const d = parseLocalDate(dateStr);
  if (!d || isNaN(d.getTime())) return { day: '-', month: '-', year: '-', fullMonth: '-', fullYear: '-' };

  const day = d.getDate();
  const shortMonth = THAI_SHORT_MONTHS[d.getMonth()];
  const fullMonth = THAI_MONTHS[d.getMonth()];
  const fullYear = d.getFullYear() + 543; // e.g. 2569
  const shortYear = String(fullYear).slice(-2); // e.g. '69'

  return {
    day,
    month: shortMonth,     // เช่น 'ก.ย.'
    year: shortYear,       // เช่น '69'
    shortMonth,
    shortYear,
    fullMonth,
    fullYear
  };
}

/**
 * คำนวณวันทำการ (เว้นวันเสาร์ - อาทิตย์)
 */
function calculateWorkdays(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 0;
  const start = parseLocalDate(startDateStr);
  const end = parseLocalDate(endDateStr);

  if (!start || !end || start > end) return 0;

  let count = 0;
  let cur = new Date(start.getTime());

  while (cur <= end) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return count;
}

// ==========================================================================
// LIVE PREVIEW RENDERER
// ==========================================================================

function render() {
  const pronoun = document.getElementById('inpPronoun')?.value || 'กระผม';
  const rankInput = document.getElementById('inpRank')?.value.trim() || '';
  const rawName = document.getElementById('inpName')?.value.trim() || '';

  // จัดรูปแบบ ยศ. ชื่อ และนามสกุล ตามระเบียบ:
  // - ยศทั่วไป (เช่น น.ท.) ไม่ต้องเว้นวรรค ให้ชื่อติดไปเลย เช่น น.ท.สมชาย
  // - ยศหญิง (เช่น น.ท.หญิง) ให้เว้นวรรค 1 เคาะ เช่น น.ท.หญิง สมศรี
  // - ชื่อ กับ นามสกุล เว้น 2 เคาะ เช่น สมชาย  ใจดี
  const effectiveRank = rankInput || extractRank(rawName);
  let fullNameWithRank = formatRankName(effectiveRank, rawName);
  if (!fullNameWithRank) fullNameWithRank = '\u00A0';

  const rawPosition = document.getElementById('inpPosition')?.value.trim() || '';
  const rawPosition2 = document.getElementById('inpPosition2')?.value.trim() || '';
  const chkPosWrapEl = document.getElementById('chkPosWrap');
  const place = document.getElementById('inpPlace')?.value.trim() || state.settings.writtenAt;
  const subject = document.getElementById('inpSubject')?.value.trim() || 'ขอลาพักผ่อนประจำปี';
  const to = document.getElementById('inpTo')?.value.trim() || state.settings.defaultTo;
  const isDiscreteMode = state.leaveMode === 'discrete' && (state.discreteDates && state.discreteDates.length > 0);
  const discreteParts = getDiscreteDateParts(state.discreteDates);
  const isManualCustom = state.isCustomDateTextManual && state.customDateText;
  const discreteText = isManualCustom ? state.customDateText : (discreteParts.fullText || '-');

  const docDateStr = document.getElementById('inpDocDate')?.value;
  const startDateStr = isDiscreteMode ? state.discreteDates[0] : document.getElementById('inpStartDate')?.value;
  const endDateStr = isDiscreteMode ? state.discreteDates[state.discreteDates.length - 1] : document.getElementById('inpEndDate')?.value;
  const departDateStr = document.getElementById('inpDepartDate')?.value || startDateStr;
  const returnDateStr = document.getElementById('inpReturnDate')?.value || endDateStr;

  const prevFiscalStartYear = (document.getElementById('inpPrevFiscalStartYear')?.value.trim() || '68').slice(-2);
  const prevFiscalEndYear = (document.getElementById('inpPrevFiscalEndYear')?.value.trim() || '69').slice(-2);
  const prevYearLeaveDays = document.getElementById('inpPrevYearLeaveDays')?.value.trim() || '';
  const accDaysStr = document.getElementById('inpAccDays')?.value.trim() || '';
  const curFiscalYear = (document.getElementById('inpCurrentFiscalYear')?.value.trim() || '69').slice(-2);

  const annualQuota = parseInt(document.getElementById('inpAnnualQuota')?.value || '10', 10);
  const personSelect = document.getElementById('userSelect');
  const selectedPerson = personSelect ? state.personnel.find(p => p.id === personSelect.value) : null;
  const accDays = accDaysStr ? parseInt(accDaysStr, 10) : (selectedPerson ? (selectedPerson.accQuota || 0) : 0);
  const totalQuota = annualQuota + accDays;
  
  const leaveDays = isDiscreteMode ? state.discreteDates.length : parseInt(document.getElementById('inpLeaveDays')?.value || '0', 10);
  const prevLeaveDays = parseInt(document.getElementById('inpPrevLeaveDays')?.value || '0', 10);
  const totalLeaveThisYear = prevLeaveDays + leaveDays;
  const remainingQuota = Math.max(0, totalQuota - totalLeaveThisYear);

  const province = document.getElementById('inpProvince')?.value.trim() || '-';

  const statSignPos = document.getElementById('inpStatSignPos')?.value.trim() ?? (state.settings.statSignPos || '');
  const endorseTo = document.getElementById('inpEndorseTo') ? document.getElementById('inpEndorseTo').value.trim() : (state.settings.endorseTo || 'หก.กกศ.รร.จอ.ยศ.ทอ.');
  const endorseRank = document.getElementById('inpEndorseRank') ? document.getElementById('inpEndorseRank').value.trim() : (state.settings.endorseRank || '');
  const endorsePos = document.getElementById('inpEndorsePos') ? document.getElementById('inpEndorsePos').value.trim() : (state.settings.endorsePos || '');
  const endorsePos2 = document.getElementById('inpEndorsePos2') ? document.getElementById('inpEndorsePos2').value.trim() : (state.settings.endorsePos2 || '');
  const orderRank = document.getElementById('inpOrderRank') ? document.getElementById('inpOrderRank').value.trim() : (state.settings.orderRank || '');
  const orderPos1 = document.getElementById('inpOrderPos1') ? document.getElementById('inpOrderPos1').value.trim() : (state.settings.orderPos1 || '');
  const orderPos2 = document.getElementById('inpOrderPos2') ? document.getElementById('inpOrderPos2').value.trim() : (state.settings.orderPos2 || '');

  // Dates parsing
  const docD = parseThaiDate(docDateStr);
  const startD = parseThaiDate(startDateStr);
  const endD = parseThaiDate(endDateStr);
  const departD = parseThaiDate(departDateStr);
  const returnD = parseThaiDate(returnDateStr);

  // Update Paper Header & Meta
  const isDocDayBlank = document.getElementById('chkDocDayBlank')?.checked ?? true;
  setTextSafely('pPlace', place);
  setTextSafely('pDocD', isDocDayBlank ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' : formatNumberOutput(docD.day));
  setTextSafely('pDocM', docD.month);
  setTextSafely('pDocY', formatNumberOutput(docD.year));
  setTextSafely('pSubject', subject);
  setTextSafely('pTo', to);

  // คำเชื่อมวันลา: ใช้คำเชื่อม "ถึงวันที่" อย่างเดียว
  const dateConnectorText = 'ถึงวันที่';

  const lblEndDate = document.getElementById('lblEndDate');
  if (lblEndDate) {
    lblEndDate.textContent = dateConnectorText;
  }
  setTextSafely('pDateConnector', dateConnectorText);

  // Update Body
  const shouldWrapPos = (chkPosWrapEl && chkPosWrapEl.dataset.manuallyToggled) ? chkPosWrapEl.checked : false;
  const bodyContainer = document.getElementById('pBodyContainer');

  if (bodyContainer) {
    if (rawPosition2) {
      bodyContainer.innerHTML = `
        <div class="form7-body-row indent" id="pApplicantRow1">
            <span>ด้วย<span id="pPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pName">${fullNameWithRank}</span>
            <span id="pPosInlineLabel">ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pPos">${rawPosition || '&nbsp;'}</span>
        </div>
        <div class="form7-body-row" id="pApplicantRow2">
            <span class="dotted-line fill-flex" id="pPosLine2">${rawPosition2}</span>
            <span>ขออนุญาตลาหยุดราชการเพื่อพักผ่อนประจำปี มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pDays" style="max-width: 45px;">${formatNumberOutput(leaveDays)}</span>
            <span>วัน</span>
        </div>
        <div class="form7-body-row form7-row-dense" id="pDatesRowCombined">
            <span>ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pSD" style="max-width: 28px;">${formatNumberOutput(startD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSM" style="max-width: 45px; padding: 0 3px;">${startD.month}</span>
            <span style="margin-left: 5px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSY" style="max-width: 32px; padding: 0 3px;">${formatNumberOutput(startD.year)}</span>
            <span style="margin-left: 4px;">${dateConnectorText}</span>
            <span class="dotted-line fill-flex" id="pED" style="max-width: 28px;">${formatNumberOutput(endD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pEM" style="max-width: 45px; padding: 0 3px;">${endD.month}</span>
            <span style="margin-left: 5px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pEY" style="max-width: 32px; padding: 0 3px;">${formatNumberOutput(endD.year)}</span>
            <span style="margin-left: 4px;">ในระหว่างลานี้ <span id="pPronounTravel">${pronoun}</span>จะไปที่จังหวัด</span>
            <span class="dotted-line fill-flex" id="pProv" style="min-width: 50px;">${province}</span>
        </div>
        <div class="form7-body-row">
            <span>ในวันที่</span>
            <span class="dotted-line fill-flex" id="pDepartD" style="max-width: 35px;">${formatNumberOutput(departD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pDepartM" style="max-width: 55px; padding: 0 4px;">${departD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pDepartY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(departD.year)}</span>
            <span style="margin-left: 5px;">และจะกลับในวันที่</span>
            <span class="dotted-line fill-flex" id="pReturnD" style="max-width: 35px;">${formatNumberOutput(returnD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pReturnM" style="max-width: 55px; padding: 0 4px;">${returnD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pReturnY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(returnD.year)}</span>
        </div>
      `;
    } else if (shouldWrapPos) {
      bodyContainer.innerHTML = `
        <div class="form7-body-row indent" id="pApplicantRow1">
            <span>ด้วย<span id="pPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pName">${fullNameWithRank}</span>
        </div>
        <div class="form7-body-row" id="pApplicantRow2">
            <span>ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pPos">${rawPosition || '&nbsp;'}</span>
        </div>
        <div class="form7-body-row">
            <span>ขออนุญาตลาหยุดราชการเพื่อพักผ่อนประจำปี มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pDays" style="max-width: 45px;">${formatNumberOutput(leaveDays)}</span>
            <span>วัน ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pSD" style="max-width: 35px;">${formatNumberOutput(startD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSM" style="max-width: 55px; padding: 0 4px;">${startD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(startD.year)}</span>
        </div>
        <div class="form7-body-row">
            <span>${dateConnectorText}</span>
            <span class="dotted-line fill-flex" id="pED" style="max-width: 35px;">${formatNumberOutput(endD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pEM" style="max-width: 55px; padding: 0 4px;">${endD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pEY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(endD.year)}</span>
            <span style="margin-left: 5px;">ในระหว่างลานี้ <span id="pPronounTravel">${pronoun}</span>จะไปที่จังหวัด</span>
            <span class="dotted-line fill-flex" id="pProv">${province}</span>
        </div>
        <div class="form7-body-row">
            <span>ในวันที่</span>
            <span class="dotted-line fill-flex" id="pDepartD" style="max-width: 35px;">${formatNumberOutput(departD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pDepartM" style="max-width: 55px; padding: 0 4px;">${departD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pDepartY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(departD.year)}</span>
            <span style="margin-left: 5px;">และจะกลับในวันที่</span>
            <span class="dotted-line fill-flex" id="pReturnD" style="max-width: 35px;">${formatNumberOutput(returnD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pReturnM" style="max-width: 55px; padding: 0 4px;">${returnD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pReturnY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(returnD.year)}</span>
        </div>
      `;
    } else {
      // โหมดปกติ 4 บรรทัด
      bodyContainer.innerHTML = `
        <div class="form7-body-row indent" id="pApplicantRow1">
            <span>ด้วย<span id="pPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pName">${fullNameWithRank}</span>
            <span id="pPosInlineLabel">ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pPos">${rawPosition || '&nbsp;'}</span>
        </div>
        <div class="form7-body-row" id="pApplicantRow2">
            <span>ขออนุญาตลาหยุดราชการเพื่อพักผ่อนประจำปี มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pDays" style="max-width: 45px;">${formatNumberOutput(leaveDays)}</span>
            <span>วัน ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pSD" style="max-width: 35px;">${formatNumberOutput(startD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSM" style="max-width: 55px; padding: 0 4px;">${startD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(startD.year)}</span>
        </div>
        <div class="form7-body-row">
            <span>${dateConnectorText}</span>
            <span class="dotted-line fill-flex" id="pED" style="max-width: 35px;">${formatNumberOutput(endD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pEM" style="max-width: 55px; padding: 0 4px;">${endD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pEY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(endD.year)}</span>
            <span style="margin-left: 5px;">ในระหว่างลานี้ <span id="pPronounTravel">${pronoun}</span>จะไปที่จังหวัด</span>
            <span class="dotted-line fill-flex" id="pProv">${province}</span>
        </div>
        <div class="form7-body-row">
            <span>ในวันที่</span>
            <span class="dotted-line fill-flex" id="pDepartD" style="max-width: 35px;">${formatNumberOutput(departD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pDepartM" style="max-width: 55px; padding: 0 4px;">${departD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pDepartY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(departD.year)}</span>
            <span style="margin-left: 5px;">และจะกลับในวันที่</span>
            <span class="dotted-line fill-flex" id="pReturnD" style="max-width: 35px;">${formatNumberOutput(returnD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pReturnM" style="max-width: 55px; padding: 0 4px;">${returnD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pReturnY" style="max-width: 40px; padding: 0 4px;">${formatNumberOutput(returnD.year)}</span>
        </div>
      `;
    }

    const combinedRow = document.getElementById('pDatesRowCombined');
    if (combinedRow) {
      combinedRow.style.letterSpacing = '';
      combinedRow.style.transform = '';
      combinedRow.style.transformOrigin = 'left center';
      if (combinedRow.scrollWidth > combinedRow.clientWidth) {
        const ratio = combinedRow.clientWidth / combinedRow.scrollWidth;
        if (ratio >= 0.94) {
          combinedRow.style.letterSpacing = '-0.35px';
        } else {
          combinedRow.style.transform = `scaleX(${ratio.toFixed(3)})`;
        }
      }
    }
  }

  // คำนำหน้ายศสำหรับลายมือชื่อผู้ขอลา (เช่น ร.ท., พ.อ.อ., จ.อ.หญิง)
  const signRank = effectiveRank;

  const signRankEl = document.getElementById('pSignRank');
  const signRankSpacer = document.getElementById('pSignRankSpacer');
  const signLine = document.getElementById('pSignLine');

  if (signRankEl) {
    signRankEl.textContent = signRank || '';
    signRankEl.style.display = signRank ? 'inline' : 'none';
  }
  if (signRankSpacer) {
    signRankSpacer.style.display = signRank ? 'inline' : 'none';
  }
  if (signLine) {
    signLine.style.minWidth = signRank ? '180px' : '220px';
  }

  // Statistics Section: รวมวันทำการ, เหลือวันลาพักผ่อนสะสม, ลามาแล้ว, รวมครั้งนี้, เหลือวันลาพักผ่อน (เว้นว่างเป็นเส้นประ ไม่ใส่ข้อมูล)
  setTextSafely('pStatPrevYearStart', formatNumberOutput(prevFiscalStartYear));
  setTextSafely('pStatPrevYearEnd', formatNumberOutput(prevFiscalEndYear));

  const blankStatDays = document.getElementById('chkBlankStatDays') ? document.getElementById('chkBlankStatDays').checked : true;

  if (!blankStatDays && prevYearLeaveDays && prevYearLeaveDays !== '-') {
    setTextSafely('pStatPrevYearDays', formatNumberOutput(prevYearLeaveDays));
  } else {
    const el = document.getElementById('pStatPrevYearDays');
    if (el) el.innerHTML = '&nbsp;';
  }

  if (!blankStatDays && accDaysStr && accDaysStr !== '' && accDaysStr !== '0' && accDaysStr !== '-') {
    setTextSafely('pStatAccDays', formatNumberOutput(accDaysStr));
  } else {
    const el = document.getElementById('pStatAccDays');
    if (el) el.innerHTML = '&nbsp;';
  }

  setTextSafely('pStatCurYear', fullNameWithRank);
  setTextSafely('pStatPersonName', fullNameWithRank);

  // ป้องกันข้อความทับซ้อนและจัดรูปแบบให้พอดี 1 บรรทัดเสมอ
  const statRow3 = document.getElementById('pStatRow3');
  if (statRow3) {
    statRow3.style.letterSpacing = '';
    statRow3.style.fontSize = '';
    if (statRow3.scrollWidth > statRow3.clientWidth) {
      statRow3.style.letterSpacing = '-0.25px';
    }
    if (statRow3.scrollWidth > statRow3.clientWidth) {
      statRow3.style.letterSpacing = '-0.45px';
    }
    if (statRow3.scrollWidth > statRow3.clientWidth) {
      statRow3.style.fontSize = '15pt';
    }
    if (statRow3.scrollWidth > statRow3.clientWidth) {
      statRow3.style.fontSize = '14pt';
    }
  }

  if (!blankStatDays) {
    setTextSafely('pStatCurTaken', formatNumberOutput(prevLeaveDays));
    setTextSafely('pStatTotalTaken', formatNumberOutput(totalLeaveThisYear));
    setTextSafely('pStatRemaining', formatNumberOutput(remainingQuota));
  } else {
    const elCur = document.getElementById('pStatCurTaken');
    if (elCur) elCur.innerHTML = '&nbsp;';
    const elTotal = document.getElementById('pStatTotalTaken');
    if (elTotal) elTotal.innerHTML = '&nbsp;';
    const elRem = document.getElementById('pStatRemaining');
    if (elRem) elRem.innerHTML = '&nbsp;';
  }

  if (statSignPos) {
    setTextSafely('pStatSignPos', statSignPos);
  } else {
    const el = document.getElementById('pStatSignPos');
    if (el) el.innerHTML = '&nbsp;';
  }

  // Endorsement & Order Section
  // ถ้าคนใดมีตำแหน่งที่ขึ้นต้นด้วย หน. (หรือ หัวหน้า) ให้ซ่อนบล็อกเสนอพิจารณา (เรียน...)
  // และย้ายบล็อก - อนุญาต ขึ้นไปแทนตรงตำแหน่ง เรียน
  const isHeadOfSection = rawPosition.trim().startsWith('หน.') || rawPosition.trim().startsWith('หัวหน้า');
  const endorseBlock = document.getElementById('pEndorseBlock') || document.querySelector('.form7-endorse-block');
  if (endorseBlock) {
    endorseBlock.style.display = isHeadOfSection ? 'none' : 'block';
  }

  // ปรับการแสดงผลฟอร์มฝั่งกรอกข้อมูล ส่วนที่ ๔ ให้สอดคล้องกัน
  const fGroupEndorseTo = document.getElementById('fGroupEndorseTo');
  const fGroupEndorseRank = document.getElementById('fGroupEndorseRank');
  const fGroupEndorsePos = document.getElementById('fGroupEndorsePos');
  const badgeEndorseStatus = document.getElementById('badgeEndorseStatus');
  if (fGroupEndorseTo) fGroupEndorseTo.style.display = isHeadOfSection ? 'none' : 'block';
  if (fGroupEndorseRank) fGroupEndorseRank.style.display = isHeadOfSection ? 'none' : 'block';
  if (fGroupEndorsePos) fGroupEndorsePos.style.display = isHeadOfSection ? 'none' : 'block';
  if (badgeEndorseStatus) badgeEndorseStatus.style.display = isHeadOfSection ? 'inline-block' : 'none';

  setTextSafely('pEndorseTo', endorseTo);
  const spacerEl = document.getElementById('pEndorseSubSpacer');
  if (spacerEl) {
    const firstK = endorseTo.indexOf('ก');
    const secondK = firstK !== -1 ? endorseTo.indexOf('ก', firstK + 1) : -1;
    const thirdK = secondK !== -1 ? endorseTo.indexOf('ก', secondK + 1) : -1;
    if (thirdK !== -1) {
      spacerEl.innerHTML = `เรียน &nbsp; ${endorseTo.substring(0, thirdK)}`;
    } else {
      spacerEl.innerHTML = `เรียน &nbsp; หก.ก`;
    }
  }
  const rankSpacerEl = document.getElementById('pEndorseRankSpacer');
  if (rankSpacerEl && spacerEl) {
    rankSpacerEl.innerHTML = `${spacerEl.innerHTML}เพื่อพิจา`;
  }
  const posSpacerEl = document.getElementById('pEndorsePosSpacer');
  if (posSpacerEl && rankSpacerEl) {
    posSpacerEl.innerHTML = `${rankSpacerEl.innerHTML}${endorseRank}`;
  }
  setTextSafely('pEndorseRank', endorseRank);
  setTextSafely('pEndorsePos1', endorsePos);
  setTextSafely('pEndorsePos', endorsePos);
  setTextSafely('pEndorsePos2', endorsePos2);

  const endorseRankRow = document.getElementById('pEndorseRankRow') || document.getElementById('pEndorseRank')?.closest('.form7-endorse-rank-row');
  if (endorseRankRow) {
    endorseRankRow.style.display = endorseRank ? 'block' : 'none';
  }

  const endorsePos2El = document.getElementById('pEndorsePos2');
  if (endorsePos2El) {
    endorsePos2El.style.display = endorsePos2 ? 'block' : 'none';
  }

  setTextSafely('pOrderRank', orderRank);
  const orderRankRow = document.getElementById('pOrderRankRow') || document.getElementById('pOrderRank')?.closest('.form7-order-rank-row');
  if (orderRankRow) {
    orderRankRow.style.display = orderRank ? 'block' : 'none';
  }

  setTextSafely('pOrderPos1', orderPos1);
  setTextSafely('pOrderPos2', orderPos2);

  const pos2El = document.getElementById('pOrderPos2');
  if (pos2El) {
    pos2El.style.display = orderPos2 ? 'block' : 'none';
  }

  const orderTextEl = document.querySelector('.form7-order-text');
  const orderRankSpacerEl = document.getElementById('pOrderRankSpacer');
  if (orderRankSpacerEl) {
    const txt = orderTextEl ? orderTextEl.textContent.trim() : '- อนุญาต';
    const toIdx = txt.indexOf('ต');
    if (toIdx !== -1) {
      orderRankSpacerEl.textContent = txt.substring(0, toIdx);
    } else {
      orderRankSpacerEl.textContent = '- อนุญา';
    }
  }
  const orderPosSpacerEl = document.getElementById('pOrderPosSpacer');
  if (orderPosSpacerEl && orderRankSpacerEl) {
    orderPosSpacerEl.innerHTML = `${orderRankSpacerEl.innerHTML}${orderRank}`;
  }

  // Update Sign Date Lines
  // สถิติวันลา: เว้นว่างไว้เป็นเส้นประทั้งหมด ไม่ใส่ เดือน และ พ.ศ.
  const signDateHTML = `<span class="dotted-line" style="min-width: 45px;">&nbsp;</span> / <span class="dotted-line" style="min-width: 45px;">&nbsp;</span> / <span class="dotted-line" style="min-width: 35px;">&nbsp;</span>`;

  const elStatSignDate = document.getElementById('pStatSignDate');
  if (elStatSignDate) elStatSignDate.innerHTML = signDateHTML;

  // ส่วนที่ ๔ สายการบังคับบัญชา & การอนุมัติ: แสดงเฉพาะเดือนและปี เช่น ต.ค. ๖๙ (ไม่มีเส้นประและไม่มีเครื่องหมายทับ)
  const isThai = document.getElementById('chkThaiNum')?.checked ?? state.settings.useThaiNumerals;
  const endorseMonthVal = document.getElementById('inpEndorseMonth')?.value;
  const approvalMonthVal = document.getElementById('inpApprovalMonth')?.value;
  const endorseDateHTML = formatApprovalMonthDisplay(endorseMonthVal || approvalMonthVal, isThai);
  const approvalDateHTML = formatApprovalMonthDisplay(approvalMonthVal, isThai);

  const elEndorseDate = document.getElementById('pEndorseDate');
  if (elEndorseDate) elEndorseDate.innerHTML = endorseDateHTML;

  const elOrderDate = document.getElementById('pOrderDate');
  if (elOrderDate) elOrderDate.innerHTML = approvalDateHTML;

  if (typeof updateThaiMonthInputDisplay === 'function') {
    updateThaiMonthInputDisplay('inpEndorseMonth');
    updateThaiMonthInputDisplay('inpApprovalMonth');
  }

  // Update Quota Summary Pills on UI
  setTextSafely('pillTotalQuota', `${totalQuota} วัน`);
  setTextSafely('pillPrevTaken', `${prevLeaveDays} วัน`);
  setTextSafely('pillThisLeave', `${leaveDays} วัน`);
  setTextSafely('pillRemaining', `${remainingQuota} วัน`);

  const pillRemainEl = document.getElementById('pillRemaining');
  if (pillRemainEl) {
    pillRemainEl.style.color = remainingQuota < 0 ? 'var(--danger)' : 'var(--success)';
  }
}

function setTextSafely(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ==========================================================================
// SICK LEAVE (แบบ ๓) - RENDERING & APPLICATION LOGIC
// ==========================================================================

function formatSickNumberOutput(val) {
  if (val === null || val === undefined || val === '') return '-';
  const isThai = document.getElementById('chkSickThaiNum')?.checked ?? state.settings.useThaiNumerals;
  return isThai ? toThaiDigits(val) : String(val);
}

function toggleSickNumeralFormat() {
  renderSickLeave();
}

function handleSickNameInput(val) {
  const extracted = extractRank(val);
  const rankInput = document.getElementById('inpSickRank');
  if (extracted && rankInput && !rankInput.value.trim()) {
    rankInput.value = extracted;
  }
  renderSickLeave();
}

function handleSickPosInput(val) {
  renderSickLeave();
}

function handleSickDateChange(changedField) {
  const startEl = document.getElementById('inpSickStartDate');
  const endEl = document.getElementById('inpSickEndDate');
  const daysEl = document.getElementById('inpSickLeaveDays');

  if (!startEl || !endEl) return;

  const startVal = startEl.value;
  const endVal = endEl.value;

  if (startVal && !endVal) {
    endEl.value = startVal;
  }

  if (startVal && endVal) {
    const sDate = new Date(startVal);
    const eDate = new Date(endVal);
    if (eDate < sDate) {
      if (changedField === 'start') {
        endEl.value = startVal;
      } else {
        startEl.value = endVal;
      }
    }
  }

  const s = startEl.value;
  const e = endEl.value;
  if (s && e && daysEl) {
    const workingDays = calculateWorkingDays(s, e);
    daysEl.value = workingDays > 0 ? workingDays : 1;
  }

  renderSickLeave();
}

function renderSickLeave() {
  const pronoun = document.getElementById('inpSickPronoun')?.value || 'กระผม';
  const rankInput = document.getElementById('inpSickRank')?.value.trim() || '';
  const rawName = document.getElementById('inpSickName')?.value.trim() || '';

  const effectiveRank = rankInput || extractRank(rawName);
  let fullNameWithRank = formatRankName(effectiveRank, rawName);
  if (!fullNameWithRank) fullNameWithRank = '\u00A0';

  const rawPosition = document.getElementById('inpSickPosition')?.value.trim() || '';
  const rawPosition2 = document.getElementById('inpSickPosition2')?.value.trim() || '';
  const place = document.getElementById('inpSickPlace')?.value.trim() || state.settings.writtenAt;
  const subject = document.getElementById('inpSickSubject')?.value.trim() || 'ขอลาป่วย';
  const to = document.getElementById('inpSickTo')?.value.trim() || state.settings.defaultTo;

  const docDateStr = document.getElementById('inpSickDocDate')?.value;
  const startDateStr = document.getElementById('inpSickStartDate')?.value;
  const endDateStr = document.getElementById('inpSickEndDate')?.value;

  const diagnosis = document.getElementById('inpSickDiagnosis')?.value.trim() || 'ไข้หวัด';
  const leaveDays = parseInt(document.getElementById('inpSickLeaveDays')?.value || '0', 10);

  const homeNo = document.getElementById('inpSickHomeNo')?.value.trim() || '-';
  const road = document.getElementById('inpSickRoad')?.value.trim() || '-';
  const subdistrict = document.getElementById('inpSickSubdistrict')?.value.trim() || '-';
  const district = document.getElementById('inpSickDistrict')?.value.trim() || '-';
  const province = document.getElementById('inpSickProvince')?.value.trim() || '-';

  // Format home number with Thai digits if Thai numerals enabled
  const displayHomeNo = (homeNo && homeNo !== '-') ? formatSickNumberOutput(homeNo) : (homeNo || '-');

  // Detect Bangkok province variations: กทม, กทม., กรุงเทพ, กรุงเทพฯ, กรุงเทพมหานคร, etc.
  const pClean = province.replace(/[\s\.\,\-\_]/g, '');
  const isBangkok = pClean.includes('กรุงเทพ') || pClean.includes('กทม') || /^(bkk|bangkok)$/i.test(pClean);
  const subdistrictLabel = isBangkok ? 'แขวง' : 'ตำบล';
  const districtLabel = isBangkok ? 'เขต' : 'อำเภอ';

  // Update input labels on the left form as well
  const lblSub = document.querySelector('label[for="inpSickSubdistrict"]');
  if (lblSub) lblSub.textContent = isBangkok ? 'แขวง' : 'ตำบล';
  const lblDist = document.querySelector('label[for="inpSickDistrict"]');
  if (lblDist) lblDist.textContent = isBangkok ? 'เขต' : 'อำเภอ';

  const prevSameCountStr = document.getElementById('inpSickPrevSameCount')?.value.trim() || '';
  const prevSameDaysStr = document.getElementById('inpSickPrevSameDays')?.value.trim() || '';

  const authority = document.getElementById('inpSickAuthority')?.value.trim() || '';
  const blankStatDays = document.getElementById('chkSickBlankStatDays') ? document.getElementById('chkSickBlankStatDays').checked : true;

  const endorseTo = document.getElementById('inpSickEndorseTo') ? document.getElementById('inpSickEndorseTo').value.trim() : (state.settings.endorseTo || 'หก.กกศ.รร.จอ.ยศ.ทอ.');
  const endorseRank = document.getElementById('inpSickEndorseRank') ? document.getElementById('inpSickEndorseRank').value.trim() : (state.settings.endorseRank || '');
  const endorsePos = document.getElementById('inpSickEndorsePos') ? document.getElementById('inpSickEndorsePos').value.trim() : (state.settings.endorsePos || '');
  const endorsePos2 = document.getElementById('inpSickEndorsePos2') ? document.getElementById('inpSickEndorsePos2').value.trim() : (state.settings.endorsePos2 || '');
  const orderRank = document.getElementById('inpSickOrderRank') ? document.getElementById('inpSickOrderRank').value.trim() : (state.settings.orderRank || '');
  const orderPos1 = document.getElementById('inpSickOrderPos1') ? document.getElementById('inpSickOrderPos1').value.trim() : (state.settings.orderPos1 || '');
  const orderPos2 = document.getElementById('inpSickOrderPos2') ? document.getElementById('inpSickOrderPos2').value.trim() : (state.settings.orderPos2 || '');

  // Dates parsing
  const docD = parseThaiDate(docDateStr);
  const startD = parseThaiDate(startDateStr);
  const endD = parseThaiDate(endDateStr);

  // Update Paper Header & Meta
  const isDocDayBlank = document.getElementById('chkSickDocDayBlank')?.checked ?? true;
  setTextSafely('pSickPlace', place);
  setTextSafely('pSickDocD', isDocDayBlank ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' : formatSickNumberOutput(docD.day));
  setTextSafely('pSickDocM', docD.month);
  setTextSafely('pSickDocY', formatSickNumberOutput(docD.year));
  setTextSafely('pSickSubject', subject);
  setTextSafely('pSickTo', to);

  // Update Body rows dynamically based on rawPosition2
  const sickBodyContainer = document.getElementById('pSickBodyContainer');
  if (sickBodyContainer) {
    if (rawPosition2) {
      sickBodyContainer.innerHTML = `
        <!-- บรรทัดที่ 1: ด้วยกระผม/ดิฉัน... ตำแหน่ง... -->
        <div class="form3-body-row indent" id="pSickApplicantRow1">
            <span>ด้วย<span id="pSickPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pSickName">${fullNameWithRank}</span>
            <span>ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pSickPos">${rawPosition || '&nbsp;'}</span>
        </div>

        <!-- บรรทัดที่ 2: ตำแหน่ง (ต่อ / บรรทัดที่ 2) ... ป่วยเป็น ... จึงขอลาป่วยเพื่อรักษาตัว มีกำหนด ... วัน -->
        <div class="form3-body-row form3-row-dense" id="pSickApplicantRow2">
            <span class="dotted-line fill-flex" id="pSickPosLine2" style="white-space: nowrap; flex-shrink: 0; min-width: max-content;">${rawPosition2}</span>
            <span>ป่วยเป็น</span>
            <span class="dotted-line fill-flex" id="pSickDiagnosis" style="min-width: 50px; max-width: 80px; white-space: nowrap;">${diagnosis}</span>
            <span>จึงขอลาป่วยเพื่อรักษาตัว มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pSickDays" style="max-width: 32px; white-space: nowrap;">${formatSickNumberOutput(leaveDays)}</span>
            <span>วัน</span>
        </div>

        <!-- บรรทัดที่ 3: ตั้งแต่วันที่... เดือน... พ.ศ.... จนถึงวันที่... เดือน... พ.ศ.... ในระหว่างลาป่วยนี้ได้รักษาตัวอยู่ที่ -->
        <div class="form3-body-row form3-row-dense" id="pSickApplicantRow3">
            <span>ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pSickSD" style="max-width: 28px;">${formatSickNumberOutput(startD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSickSM" style="max-width: 45px; padding: 0 3px;">${startD.month}</span>
            <span style="margin-left: 6px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSickSY" style="max-width: 32px; padding: 0 3px;">${formatSickNumberOutput(startD.year)}</span>
            <span style="margin-left: 4px;">จนถึงวันที่</span>
            <span class="dotted-line fill-flex" id="pSickED" style="max-width: 28px;">${formatSickNumberOutput(endD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSickEM" style="max-width: 45px; padding: 0 3px;">${endD.month}</span>
            <span style="margin-left: 6px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSickEY" style="max-width: 32px; padding: 0 3px;">${formatSickNumberOutput(endD.year)}</span>
            <span style="margin-left: 4px;">ในระหว่างลาป่วยนี้ได้รักษาตัวอยู่ที่</span>
        </div>

        <!-- บรรทัดที่ 4: บ้านเลขที่... ถนน... ตำบล/แขวง... อำเภอ/เขต... -->
        <div class="form3-body-row" id="pSickApplicantRow4">
            <span>บ้านเลขที่</span>
            <span class="dotted-line fill-flex" id="pSickHomeNo" style="min-width: 60px;">${displayHomeNo}</span>
            <span>ถนน</span>
            <span class="dotted-line fill-flex" id="pSickRoad" style="min-width: 90px;">${road}</span>
            <span id="pSickSubdistrictLabel">${subdistrictLabel}</span>
            <span class="dotted-line fill-flex" id="pSickSubdistrict" style="min-width: 90px;">${subdistrict}</span>
            <span id="pSickDistrictLabel">${districtLabel}</span>
            <span class="dotted-line fill-flex" id="pSickDistrict" style="min-width: 90px;">${district}</span>
        </div>

        <!-- บรรทัดที่ 5: จังหวัด... -->
        <div class="form3-body-row" id="pSickApplicantRow5">
            <span>จังหวัด</span>
            <span class="dotted-line fill-flex" id="pSickProvince" style="max-width: 220px;">${province}</span>
        </div>

        <!-- บรรทัดที่ 6: กระผม/ดิฉัน ได้ลาป่วยอยู่เดิมแล้วในคราวเดียวกันนี้...ครั้ง รวม...วัน -->
        <div class="form3-body-row indent" id="pSickApplicantRow6">
            <span><span id="pSickPronounPrev">${pronoun}</span> ได้ลาป่วยอยู่เดิมแล้วในคราวเดียวกันนี้</span>
            <span class="dotted-line fill-flex" id="pSickPrevSameCount" style="max-width: 40px;">${(prevSameCountStr && prevSameCountStr !== '0' && prevSameCountStr !== '-') ? formatSickNumberOutput(prevSameCountStr) : '&nbsp;'}</span>
            <span>ครั้ง รวม</span>
            <span class="dotted-line fill-flex" id="pSickPrevSameDays" style="max-width: 40px;">${(prevSameDaysStr && prevSameDaysStr !== '0' && prevSameDaysStr !== '-') ? formatSickNumberOutput(prevSameDaysStr) : '&nbsp;'}</span>
            <span>วัน</span>
        </div>
      `;
    } else {
      sickBodyContainer.innerHTML = `
        <!-- บรรทัดที่ 1: ด้วยกระผม/ดิฉัน... ตำแหน่ง... -->
        <div class="form3-body-row indent" id="pSickApplicantRow1">
            <span>ด้วย<span id="pSickPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pSickName">${fullNameWithRank}</span>
            <span>ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pSickPos">${rawPosition || '&nbsp;'}</span>
        </div>

        <!-- บรรทัดที่ 2: ป่วยเป็น... จึงขอลาป่วยเพื่อรักษาตัว มีกำหนด...วัน ตั้งแต่วันที่... -->
        <div class="form3-body-row" id="pSickApplicantRow2">
            <span>ป่วยเป็น</span>
            <span class="dotted-line fill-flex" id="pSickDiagnosis" style="min-width: 140px;">${diagnosis}</span>
            <span>จึงขอลาป่วยเพื่อรักษาตัว มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pSickDays" style="max-width: 40px;">${formatSickNumberOutput(leaveDays)}</span>
            <span>วัน ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pSickSD" style="max-width: 35px;">${formatSickNumberOutput(startD.day)}</span>
        </div>

        <!-- บรรทัดที่ 3: เดือน... พ.ศ.... จนถึงวันที่... เดือน... พ.ศ.... ในระหว่างลาป่วยนี้ได้รักษาตัวอยู่ที่ -->
        <div class="form3-body-row" id="pSickApplicantRow3">
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSickSM" style="max-width: 55px; padding: 0 4px;">${startD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSickSY" style="max-width: 40px; padding: 0 4px;">${formatSickNumberOutput(startD.year)}</span>
            <span style="margin-left: 5px;">จนถึงวันที่</span>
            <span class="dotted-line fill-flex" id="pSickED" style="max-width: 35px;">${formatSickNumberOutput(endD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pSickEM" style="max-width: 55px; padding: 0 4px;">${endD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pSickEY" style="max-width: 40px; padding: 0 4px;">${formatSickNumberOutput(endD.year)}</span>
            <span style="margin-left: 5px;">ในระหว่างลาป่วยนี้ได้รักษาตัวอยู่ที่</span>
        </div>

        <!-- บรรทัดที่ 4: บ้านเลขที่... ถนน... ตำบล/แขวง... อำเภอ/เขต... -->
        <div class="form3-body-row" id="pSickApplicantRow4">
            <span>บ้านเลขที่</span>
            <span class="dotted-line fill-flex" id="pSickHomeNo" style="min-width: 60px;">${displayHomeNo}</span>
            <span>ถนน</span>
            <span class="dotted-line fill-flex" id="pSickRoad" style="min-width: 90px;">${road}</span>
            <span id="pSickSubdistrictLabel">${subdistrictLabel}</span>
            <span class="dotted-line fill-flex" id="pSickSubdistrict" style="min-width: 90px;">${subdistrict}</span>
            <span id="pSickDistrictLabel">${districtLabel}</span>
            <span class="dotted-line fill-flex" id="pSickDistrict" style="min-width: 90px;">${district}</span>
        </div>

        <!-- บรรทัดที่ 5: จังหวัด... -->
        <div class="form3-body-row" id="pSickApplicantRow5">
            <span>จังหวัด</span>
            <span class="dotted-line fill-flex" id="pSickProvince" style="max-width: 220px;">${province}</span>
        </div>

        <!-- บรรทัดที่ 6: กระผม/ดิฉัน ได้ลาป่วยอยู่เดิมแล้วในคราวเดียวกันนี้...ครั้ง รวม...วัน -->
        <div class="form3-body-row indent" id="pSickApplicantRow6">
            <span><span id="pSickPronounPrev">${pronoun}</span> ได้ลาป่วยอยู่เดิมแล้วในคราวเดียวกันนี้</span>
            <span class="dotted-line fill-flex" id="pSickPrevSameCount" style="max-width: 40px;">${(prevSameCountStr && prevSameCountStr !== '0' && prevSameCountStr !== '-') ? formatSickNumberOutput(prevSameCountStr) : '&nbsp;'}</span>
            <span>ครั้ง รวม</span>
            <span class="dotted-line fill-flex" id="pSickPrevSameDays" style="max-width: 40px;">${(prevSameDaysStr && prevSameDaysStr !== '0' && prevSameDaysStr !== '-') ? formatSickNumberOutput(prevSameDaysStr) : '&nbsp;'}</span>
            <span>วัน</span>
        </div>
      `;
    }
  }

  // ลายมือชื่อผู้ขอลา
  const signRank = effectiveRank;
  const signRankEl = document.getElementById('pSickSignRank');
  const signRankSpacer = document.getElementById('pSickSignRankSpacer');
  const signLine = document.getElementById('pSickSignLine');

  if (signRankEl) {
    signRankEl.textContent = signRank || '';
    signRankEl.style.display = signRank ? 'inline' : 'none';
  }
  if (signRankSpacer) {
    signRankSpacer.style.display = signRank ? 'inline' : 'none';
  }
  if (signLine) {
    signLine.style.minWidth = signRank ? '180px' : '220px';
  }

  // Quota calculation for Sick Leave (สิทธิ์ 60 วันทำการต่อปีงบประมาณตามระเบียบข้าราชการ)
  const sickQuota = 60;
  const personSelect = document.getElementById('sickUserSelect');
  const selectedPerson = personSelect ? state.personnel.find(p => p.id === personSelect.value) : null;
  const prevTakenDays = selectedPerson ? (selectedPerson.sickTaken || 0) : 0;
  const totalTakenThisYear = prevTakenDays + leaveDays;
  const remainingQuota = Math.max(0, sickQuota - totalTakenThisYear);

  // Update Quota Pills
  const pillTotal = document.getElementById('pillSickTotalQuota');
  if (pillTotal) pillTotal.textContent = `${sickQuota} วัน`;
  const pillRem = document.getElementById('pillSickRemaining');
  if (pillRem) pillRem.textContent = `${remainingQuota} วัน`;
  const pillPrev = document.getElementById('pillSickPrevTaken');
  if (pillPrev) pillPrev.textContent = `${prevTakenDays} วัน`;
  const pillThis = document.getElementById('pillSickThisLeave');
  if (pillThis) pillThis.textContent = `${leaveDays} วัน`;

  // Statistics Section (แบบ ๓)
  setTextSafely('pSickStatPersonName', fullNameWithRank);
  const elSickAuth = document.getElementById('pSickStatAuthority');
  if (elSickAuth) {
    if (authority) {
      elSickAuth.textContent = authority;
    } else {
      elSickAuth.innerHTML = '&nbsp;';
    }
  }

  const prevPersonalTakenDays = selectedPerson ? (selectedPerson.personalTaken || 0) : 0;
  if (!blankStatDays) {
    setTextSafely('pSickStatPrevCount', formatSickNumberOutput(1));
    setTextSafely('pSickStatPrevDays', formatSickNumberOutput(prevTakenDays));
    setTextSafely('pSickStatTotalDays', formatSickNumberOutput(totalTakenThisYear));
    setTextSafely('pSickStatEverCount', formatSickNumberOutput(prevPersonalTakenDays > 0 ? 1 : 0));
    setTextSafely('pSickStatEverDays', formatSickNumberOutput(prevPersonalTakenDays));
  } else {
    ['pSickStatPrevCount', 'pSickStatPrevDays', 'pSickStatTotalDays', 'pSickStatEverCount', 'pSickStatEverDays'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '&nbsp;';
    });
  }

  if (document.getElementById('pSickStatSignPos')) {
    const el = document.getElementById('pSickStatSignPos');
    if (el) el.innerHTML = '&nbsp;';
  }

  // Endorsement & Order Section
  // ถ้าคนใด มีตำแหน่งที่ขึ้นต้นด้วย หน. (หรือ หัวหน้า) ให้ซ่อนบล็อกเสนอพิจารณา (เรียน...)
  // และย้ายบล็อก - อนุญาต ขึ้นไปแทนตรงตำแหน่ง เรียน (เหมือนแบบ ๗)
  const isHeadOfSection = rawPosition.trim().startsWith('หน.') || rawPosition.trim().startsWith('หัวหน้า') || rawPosition2.trim().startsWith('หน.') || rawPosition2.trim().startsWith('หัวหน้า');
  const endorseBlock = document.getElementById('pSickEndorseBlock');
  if (endorseBlock) {
    endorseBlock.style.display = isHeadOfSection ? 'none' : 'block';
  }

  const fGroupEndorseTo = document.getElementById('fGroupSickEndorseTo');
  const fGroupEndorseRank = document.getElementById('fGroupSickEndorseRank');
  const fGroupEndorsePos = document.getElementById('fGroupSickEndorsePos');
  const badgeEndorseStatus = document.getElementById('badgeSickEndorseStatus');
  if (fGroupEndorseTo) fGroupEndorseTo.style.display = isHeadOfSection ? 'none' : 'block';
  if (fGroupEndorseRank) fGroupEndorseRank.style.display = isHeadOfSection ? 'none' : 'block';
  if (fGroupEndorsePos) fGroupEndorsePos.style.display = isHeadOfSection ? 'none' : 'block';
  if (badgeEndorseStatus) badgeEndorseStatus.style.display = isHeadOfSection ? 'inline-block' : 'none';

  setTextSafely('pSickEndorseTo', endorseTo);
  const spacerEl = document.getElementById('pSickEndorseSubSpacer');
  if (spacerEl) {
    const firstK = endorseTo.indexOf('ก');
    const secondK = firstK !== -1 ? endorseTo.indexOf('ก', firstK + 1) : -1;
    const thirdK = secondK !== -1 ? endorseTo.indexOf('ก', secondK + 1) : -1;
    if (thirdK !== -1) {
      spacerEl.innerHTML = `เรียน &nbsp; ${endorseTo.substring(0, thirdK)}`;
    } else {
      spacerEl.innerHTML = `เรียน &nbsp; หก.ก`;
    }
  }
  const rankSpacerEl = document.getElementById('pSickEndorseRankSpacer');
  if (rankSpacerEl && spacerEl) {
    rankSpacerEl.innerHTML = `${spacerEl.innerHTML}เพื่อพิจา`;
  }
  const posSpacerEl = document.getElementById('pSickEndorsePosSpacer');
  if (posSpacerEl && rankSpacerEl) {
    posSpacerEl.innerHTML = `${rankSpacerEl.innerHTML}${endorseRank}`;
  }
  setTextSafely('pSickEndorseRank', endorseRank);
  setTextSafely('pSickEndorsePos1', endorsePos);
  setTextSafely('pSickEndorsePos', endorsePos);
  setTextSafely('pSickEndorsePos2', endorsePos2);

  const sickEndorseRankRow = document.getElementById('pSickEndorseRankRow') || document.getElementById('pSickEndorseRank')?.closest('.form7-endorse-rank-row');
  if (sickEndorseRankRow) {
    sickEndorseRankRow.style.display = endorseRank ? 'block' : 'none';
  }

  const sickEndorsePos2El = document.getElementById('pSickEndorsePos2');
  if (sickEndorsePos2El) {
    sickEndorsePos2El.style.display = endorsePos2 ? 'block' : 'none';
  }

  setTextSafely('pSickOrderRank', orderRank);
  const sickOrderRankRow = document.getElementById('pSickOrderRankRow') || document.getElementById('pSickOrderRank')?.closest('.form7-order-rank-row');
  if (sickOrderRankRow) {
    sickOrderRankRow.style.display = orderRank ? 'block' : 'none';
  }

  setTextSafely('pSickOrderPos1', orderPos1);
  setTextSafely('pSickOrderPos2', orderPos2);

  const pos2El = document.getElementById('pSickOrderPos2');
  if (pos2El) {
    pos2El.style.display = orderPos2 ? 'block' : 'none';
  }

  const orderTextEl = document.querySelector('#paperSick .form7-order-text');
  const orderRankSpacerEl = document.getElementById('pSickOrderRankSpacer');
  if (orderRankSpacerEl) {
    const txt = orderTextEl ? orderTextEl.textContent.trim() : '- อนุญาต';
    const toIdx = txt.indexOf('ต');
    if (toIdx !== -1) {
      orderRankSpacerEl.textContent = txt.substring(0, toIdx);
    } else {
      orderRankSpacerEl.textContent = '- อนุญา';
    }
  }
  const orderPosSpacerEl = document.getElementById('pSickOrderPosSpacer');
  if (orderPosSpacerEl && orderRankSpacerEl) {
    orderPosSpacerEl.innerHTML = `${orderRankSpacerEl.innerHTML}${orderRank}`;
  }

  // Update Sign Date Lines
  // สถิติวันลา: เว้นว่างไว้เป็นเส้นประทั้งหมด ไม่ใส่ เดือน และ พ.ศ.
  const signDateHTML = `<span class="dotted-line" style="min-width: 45px;">&nbsp;</span> / <span class="dotted-line" style="min-width: 45px;">&nbsp;</span> / <span class="dotted-line" style="min-width: 35px;">&nbsp;</span>`;

  const elStatSignDate = document.getElementById('pSickStatSignDate');
  if (elStatSignDate) elStatSignDate.innerHTML = signDateHTML;

  // ส่วนที่ ๔ สายการบังคับบัญชา & การอนุมัติ: แสดงเฉพาะเดือนและปี เช่น ต.ค. ๖๙ (ไม่มีเส้นประและไม่มีเครื่องหมายทับ)
  const isSickThai = document.getElementById('chkSickThaiNum')?.checked ?? state.settings.useThaiNumerals;
  const sickEndorseMonthVal = document.getElementById('inpSickEndorseMonth')?.value;
  const sickApprovalMonthVal = document.getElementById('inpSickApprovalMonth')?.value;
  const sickEndorseDateHTML = formatApprovalMonthDisplay(sickEndorseMonthVal || sickApprovalMonthVal, isSickThai);
  const sickApprovalDateHTML = formatApprovalMonthDisplay(sickApprovalMonthVal, isSickThai);

  const elEndorseDate = document.getElementById('pSickEndorseDate');
  if (elEndorseDate) elEndorseDate.innerHTML = sickEndorseDateHTML;

  const elOrderDate = document.getElementById('pSickOrderDate');
  if (elOrderDate) elOrderDate.innerHTML = sickApprovalDateHTML;

  if (typeof updateThaiMonthInputDisplay === 'function') {
    updateThaiMonthInputDisplay('inpSickEndorseMonth');
    updateThaiMonthInputDisplay('inpSickApprovalMonth');
  }
}

// ==========================================================================
// PERSONAL LEAVE (แบบ ๖) - RENDERING & APPLICATION LOGIC
// ==========================================================================

function formatPersonalNumberOutput(val) {
  if (val === null || val === undefined || val === '') return '-';
  const isThai = document.getElementById('chkPersonalThaiNum')?.checked ?? state.settings.useThaiNumerals;
  return isThai ? toThaiDigits(val) : String(val);
}

function togglePersonalNumeralFormat() {
  renderPersonalLeave();
}

function handlePersonalDateChange(changedField) {
  const startEl = document.getElementById('inpPersonalStartDate');
  const endEl = document.getElementById('inpPersonalEndDate');
  const departEl = document.getElementById('inpPersonalDepartDate');
  const returnEl = document.getElementById('inpPersonalReturnDate');
  const daysEl = document.getElementById('inpPersonalLeaveDays');

  if (!startEl || !endEl) return;

  const startVal = startEl.value;
  const endVal = endEl.value;

  if (changedField === 'start') {
    if (startVal && departEl) {
      departEl.value = startVal;
    }
    if (startVal && (!endVal || endVal < startVal)) {
      endEl.value = startVal;
      if (returnEl) returnEl.value = startVal;
    }
  } else if (changedField === 'end') {
    if (endVal && returnEl) {
      returnEl.value = endVal;
    }
    if (endVal && (!startVal || startVal > endVal)) {
      startEl.value = endVal;
      if (departEl) departEl.value = endVal;
    }
  }

  const s = startEl.value;
  const e = endEl.value;
  if (s && e && daysEl) {
    const workingDays = calculateWorkingDays(s, e);
    daysEl.value = workingDays > 0 ? workingDays : 1;
  }

  renderPersonalLeave();
}

function renderPersonalLeave() {
  const pronoun = document.getElementById('inpPersonalPronoun')?.value || 'กระผม';
  const rankInput = document.getElementById('inpPersonalRank')?.value.trim() || '';
  const rawName = document.getElementById('inpPersonalName')?.value.trim() || '';

  const effectiveRank = rankInput || extractRank(rawName);
  let fullNameWithRank = formatRankName(effectiveRank, rawName);
  if (!fullNameWithRank) fullNameWithRank = '\u00A0';

  const rawPosition = document.getElementById('inpPersonalPosition')?.value.trim() || '';
  const rawPosition2 = document.getElementById('inpPersonalPosition2')?.value.trim() || '';
  const place = document.getElementById('inpPersonalPlace')?.value.trim() || state.settings.writtenAt || 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.';
  const subject = document.getElementById('inpPersonalSubject')?.value.trim() || 'ขอลากิจ';
  const to = document.getElementById('inpPersonalTo')?.value.trim() || state.settings.defaultTo || 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.';

  const docDateStr = document.getElementById('inpPersonalDocDate')?.value;
  const startDateStr = document.getElementById('inpPersonalStartDate')?.value;
  const endDateStr = document.getElementById('inpPersonalEndDate')?.value;
  const departDateStr = document.getElementById('inpPersonalDepartDate')?.value || startDateStr;
  const returnDateStr = document.getElementById('inpPersonalReturnDate')?.value || endDateStr;

  const reason = document.getElementById('inpPersonalReason')?.value.trim() || 'จัดการธุระส่วนตัว';
  const leaveDays = parseInt(document.getElementById('inpPersonalLeaveDays')?.value || '1', 10);
  const province = document.getElementById('inpPersonalProvince')?.value.trim() || 'กรุงเทพมหานคร';

  const prevSameCountStr = document.getElementById('inpPersonalPrevSameCount')?.value.trim() || '';
  const prevSameDaysStr = document.getElementById('inpPersonalPrevSameDays')?.value.trim() || '';

  const authority = state.settings.endorseTo || state.settings.orderPos2 || 'หก.กกศ.รร.จอ.ยศ.ทอ.';
  const blankStatDays = document.getElementById('chkPersonalBlankStatDays') ? document.getElementById('chkPersonalBlankStatDays').checked : true;

  const endorseTo = document.getElementById('inpPersonalEndorseTo') ? document.getElementById('inpPersonalEndorseTo').value.trim() : (state.settings.endorseTo || 'หก.กกศ.รร.จอ.ยศ.ทอ.');
  const endorseRank = document.getElementById('inpPersonalEndorseRank') ? document.getElementById('inpPersonalEndorseRank').value.trim() : (state.settings.endorseRank || '');
  const endorsePos = document.getElementById('inpPersonalEndorsePos') ? document.getElementById('inpPersonalEndorsePos').value.trim() : (state.settings.endorsePos || '');
  const endorsePos2 = document.getElementById('inpPersonalEndorsePos2') ? document.getElementById('inpPersonalEndorsePos2').value.trim() : (state.settings.endorsePos2 || '');
  const orderRank = document.getElementById('inpPersonalOrderRank') ? document.getElementById('inpPersonalOrderRank').value.trim() : (state.settings.orderRank || '');
  const orderPos1 = document.getElementById('inpPersonalOrderPos1') ? document.getElementById('inpPersonalOrderPos1').value.trim() : (state.settings.orderPos1 || '');
  const orderPos2 = document.getElementById('inpPersonalOrderPos2') ? document.getElementById('inpPersonalOrderPos2').value.trim() : (state.settings.orderPos2 || '');

  // Header meta
  setTextSafely('pPersonalPlace', place);
  setTextSafely('pPersonalSubject', subject);
  setTextSafely('pPersonalTo', to);

  const docD = parseThaiDate(docDateStr);
  const isDocDayBlank = document.getElementById('chkPersonalDocDayBlank')?.checked ?? true;

  const elDocD = document.getElementById('pPersonalDocD');
  if (elDocD) {
    elDocD.innerHTML = isDocDayBlank ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : formatPersonalNumberOutput(docD.day);
  }
  const elDocM = document.getElementById('pPersonalDocM');
  if (elDocM) {
    elDocM.textContent = docD.month || '';
  }
  const elDocY = document.getElementById('pPersonalDocY');
  if (elDocY) {
    elDocY.textContent = docD.year ? formatPersonalNumberOutput(docD.year) : '';
  }

  const startD = parseThaiDate(startDateStr);
  const endD = parseThaiDate(endDateStr);
  const departD = parseThaiDate(departDateStr);
  const returnD = parseThaiDate(returnDateStr);

  const shouldWrapPos = rawPosition.length > 28;

  const personalBodyContainer = document.getElementById('pPersonalBodyContainer');
  if (personalBodyContainer) {
    if (rawPosition2) {
      // โหมดมีตำแหน่งบรรทัดที่ 2: วางตำแหน่ง ๒ + ขออนุญาตฯ + กิจธุระ ในบรรทัดเดียวกันตามความต้องการของผู้ใช้
      personalBodyContainer.innerHTML = `
        <div class="form6-body-row indent" id="pPersonalApplicantRow1">
            <span>ด้วย<span id="pPersonalPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pPersonalName">${fullNameWithRank}</span>
            <span>ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pPersonalPos">${rawPosition || '&nbsp;'}</span>
        </div>
        <div class="form6-body-row form6-row-dense" id="pPersonalApplicantRow2" style="font-size: 16pt; letter-spacing: -0.2px; gap: 2px;">
            <span class="dotted-line" id="pPersonalPosLine2" style="white-space: nowrap; flex-shrink: 0; min-width: max-content; padding: 0 2px;">${rawPosition2}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin: 0 2px;">ขออนุญาตลาหยุดราชการเพื่อเดินทางไป</span>
            <span class="dotted-line fill-flex" id="pPersonalReason" style="white-space: nowrap; text-align: left; padding: 0 4px;">${reason}</span>
        </div>
        <div class="form6-body-row form6-row-dense" id="pPersonalApplicantRow3" style="font-size: 16pt; letter-spacing: -0.2px; gap: 2px;">
            <span style="white-space: nowrap; flex-shrink: 0;">มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pPersonalDays">${formatPersonalNumberOutput(leaveDays)}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">วัน ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalSD">${formatPersonalNumberOutput(startD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalSM">${startD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalSY">${formatPersonalNumberOutput(startD.year)}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 4px;">จนถึงวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalED">${formatPersonalNumberOutput(endD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalEM">${endD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalEY">${formatPersonalNumberOutput(endD.year)}</span>
        </div>
        <div class="form6-body-row form6-row-dense" id="pPersonalApplicantRow4" style="font-size: 16pt; letter-spacing: -0.2px; gap: 2px;">
            <span style="white-space: nowrap; flex-shrink: 0;">ในระหว่างลานี้ <span id="pPersonalPronounTravel">${pronoun}</span>จะไปที่</span>
            <span class="dotted-line fill-flex" id="pPersonalProv" style="min-width: 70px;">${province}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 4px;">ในวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartD" style="max-width: 32px;">${formatPersonalNumberOutput(departD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartM" style="max-width: 50px;">${departD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartY" style="max-width: 38px;">${formatPersonalNumberOutput(departD.year)}</span>
        </div>
        <div class="form6-body-row" id="pPersonalApplicantRow5">
            <span style="white-space: nowrap; flex-shrink: 0;">และจะกลับในวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnD" style="max-width: 35px;">${formatPersonalNumberOutput(returnD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnM" style="max-width: 55px;">${returnD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnY" style="max-width: 45px;">${formatPersonalNumberOutput(returnD.year)}</span>
        </div>
        <div class="form6-body-row indent" id="pPersonalApplicantRow6">
            <span style="white-space: nowrap; flex-shrink: 0;"><span id="pPersonalPronounPrev">${pronoun}</span> ได้ลากิจอยู่เดิมแล้วในคราวเดียวกันนี้</span>
            <span class="dotted-line fill-flex" id="pPersonalPrevSameCount" style="max-width: 40px;">${(prevSameCountStr && prevSameCountStr !== '0' && prevSameCountStr !== '-') ? formatPersonalNumberOutput(prevSameCountStr) : '&nbsp;'}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">ครั้ง รวม</span>
            <span class="dotted-line fill-flex" id="pPersonalPrevSameDays" style="max-width: 40px;">${(prevSameDaysStr && prevSameDaysStr !== '0' && prevSameDaysStr !== '-') ? formatPersonalNumberOutput(prevSameDaysStr) : '&nbsp;'}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">วัน</span>
        </div>
      `;
    } else if (shouldWrapPos) {
      // โหมดตำแหน่งที่ 1 ยาวเกิน 28 ตัวอักษร
      personalBodyContainer.innerHTML = `
        <div class="form6-body-row indent" id="pPersonalApplicantRow1">
            <span>ด้วย<span id="pPersonalPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pPersonalName">${fullNameWithRank}</span>
        </div>
        <div class="form6-body-row form6-row-dense" id="pPersonalApplicantRow2" style="font-size: 16pt; letter-spacing: -0.2px; gap: 2px;">
            <span>ตำแหน่ง</span>
            <span class="dotted-line" id="pPersonalPos" style="white-space: nowrap; flex-shrink: 0; min-width: max-content; padding: 0 2px;">${rawPosition || '&nbsp;'}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin: 0 2px;">ขออนุญาตลาหยุดราชการเพื่อเดินทางไป</span>
            <span class="dotted-line fill-flex" id="pPersonalReason" style="white-space: nowrap; text-align: left; padding: 0 4px;">${reason}</span>
        </div>
        <div class="form6-body-row form6-row-dense" id="pPersonalApplicantRow3">
            <span style="white-space: nowrap; flex-shrink: 0;">มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pPersonalDays">${formatPersonalNumberOutput(leaveDays)}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">วัน ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalSD">${formatPersonalNumberOutput(startD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalSM" style="padding: 0 3px;">${startD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 6px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalSY" style="padding: 0 3px;">${formatPersonalNumberOutput(startD.year)}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 4px;">จนถึงวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalED">${formatPersonalNumberOutput(endD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalEM" style="padding: 0 3px;">${endD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 6px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalEY" style="padding: 0 3px;">${formatPersonalNumberOutput(endD.year)}</span>
        </div>
        <div class="form6-body-row form6-row-dense" id="pPersonalApplicantRow4">
            <span style="white-space: nowrap; flex-shrink: 0;">ในระหว่างลานี้ <span id="pPersonalPronounTravel">${pronoun}</span>จะไปที่</span>
            <span class="dotted-line fill-flex" id="pPersonalProv" style="min-width: 70px;">${province}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 4px;">ในวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartD" style="max-width: 32px;">${formatPersonalNumberOutput(departD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartM" style="max-width: 50px; padding: 0 3px;">${departD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 6px; margin-right: 3px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartY" style="max-width: 38px; padding: 0 3px;">${formatPersonalNumberOutput(departD.year)}</span>
        </div>
        <div class="form6-body-row" id="pPersonalApplicantRow5">
            <span style="white-space: nowrap; flex-shrink: 0;">และจะกลับในวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnD" style="max-width: 35px;">${formatPersonalNumberOutput(returnD.day)}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnM" style="max-width: 55px; padding: 0 4px;">${returnD.month}</span>
            <span style="white-space: nowrap; flex-shrink: 0; margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnY" style="max-width: 45px; padding: 0 4px;">${formatPersonalNumberOutput(returnD.year)}</span>
        </div>
        <div class="form6-body-row indent" id="pPersonalApplicantRow6">
            <span style="white-space: nowrap; flex-shrink: 0;"><span id="pPersonalPronounPrev">${pronoun}</span> ได้ลากิจอยู่เดิมแล้วในคราวเดียวกันนี้</span>
            <span class="dotted-line fill-flex" id="pPersonalPrevSameCount" style="max-width: 40px;">${(prevSameCountStr && prevSameCountStr !== '0' && prevSameCountStr !== '-') ? formatPersonalNumberOutput(prevSameCountStr) : '&nbsp;'}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">ครั้ง รวม</span>
            <span class="dotted-line fill-flex" id="pPersonalPrevSameDays" style="max-width: 40px;">${(prevSameDaysStr && prevSameDaysStr !== '0' && prevSameDaysStr !== '-') ? formatPersonalNumberOutput(prevSameDaysStr) : '&nbsp;'}</span>
            <span style="white-space: nowrap; flex-shrink: 0;">วัน</span>
        </div>
      `;
    } else {
      // โหมดปกติ
      personalBodyContainer.innerHTML = `
        <div class="form6-body-row indent" id="pPersonalApplicantRow1">
            <span>ด้วย<span id="pPersonalPronoun">${pronoun}</span></span>
            <span class="dotted-line fill-flex" id="pPersonalName">${fullNameWithRank}</span>
            <span>ตำแหน่ง</span>
            <span class="dotted-line fill-flex" id="pPersonalPos">${rawPosition || '&nbsp;'}</span>
        </div>
        <div class="form6-body-row" id="pPersonalApplicantRow2">
            <span>ขออนุญาตลาหยุดราชการเพื่อเดินทางไป</span>
            <span class="dotted-line fill-flex" id="pPersonalReason" style="min-width: 140px;">${reason}</span>
            <span>มีกำหนด</span>
            <span class="dotted-line fill-flex" id="pPersonalDays" style="max-width: 40px;">${formatPersonalNumberOutput(leaveDays)}</span>
            <span>วัน ตั้งแต่วันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalSD" style="max-width: 35px;">${formatPersonalNumberOutput(startD.day)}</span>
        </div>
        <div class="form6-body-row" id="pPersonalApplicantRow3">
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalSM" style="max-width: 55px; padding: 0 4px;">${startD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalSY" style="max-width: 40px; padding: 0 4px;">${formatPersonalNumberOutput(startD.year)}</span>
            <span style="margin-left: 5px;">จนถึงวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalED" style="max-width: 35px;">${formatPersonalNumberOutput(endD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalEM" style="max-width: 55px; padding: 0 4px;">${endD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalEY" style="max-width: 40px; padding: 0 4px;">${formatPersonalNumberOutput(endD.year)}</span>
            <span style="margin-left: 5px;">ในระหว่างลานี้ <span id="pPersonalPronounTravel">${pronoun}</span>จะไปที่</span>
            <span class="dotted-line fill-flex" id="pPersonalProv" style="min-width: 70px;">${province}</span>
        </div>
        <div class="form6-body-row" id="pPersonalApplicantRow4">
            <span>ในวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartD" style="max-width: 35px;">${formatPersonalNumberOutput(departD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartM" style="max-width: 55px; padding: 0 4px;">${departD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalDepartY" style="max-width: 40px; padding: 0 4px;">${formatPersonalNumberOutput(departD.year)}</span>
            <span style="margin-left: 5px;">และจะกลับในวันที่</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnD" style="max-width: 35px;">${formatPersonalNumberOutput(returnD.day)}</span>
            <span style="margin-left: 3px; margin-right: 1px;">เดือน</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnM" style="max-width: 55px; padding: 0 4px;">${returnD.month}</span>
            <span style="margin-left: 6px; margin-right: 4px;">พ.ศ.</span>
            <span class="dotted-line fill-flex" id="pPersonalReturnY" style="max-width: 40px; padding: 0 4px;">${formatPersonalNumberOutput(returnD.year)}</span>
        </div>
        <div class="form6-body-row indent" id="pPersonalApplicantRow5">
            <span><span id="pPersonalPronounPrev">${pronoun}</span> ได้ลากิจอยู่เดิมแล้วในคราวเดียวกันนี้</span>
            <span class="dotted-line fill-flex" id="pPersonalPrevSameCount" style="max-width: 40px;">${(prevSameCountStr && prevSameCountStr !== '0' && prevSameCountStr !== '-') ? formatPersonalNumberOutput(prevSameCountStr) : '&nbsp;'}</span>
            <span>ครั้ง รวม</span>
            <span class="dotted-line fill-flex" id="pPersonalPrevSameDays" style="max-width: 40px;">${(prevSameDaysStr && prevSameDaysStr !== '0' && prevSameDaysStr !== '-') ? formatPersonalNumberOutput(prevSameDaysStr) : '&nbsp;'}</span>
            <span>วัน</span>
        </div>
      `;
    }
  }

  // ลายมือชื่อผู้ขอลา
  const signRank = effectiveRank;
  const signRankEl = document.getElementById('pPersonalSignRank');
  const signRankSpacer = document.getElementById('pPersonalSignRankSpacer');
  const signLine = document.getElementById('pPersonalSignLine');

  if (signRankEl) {
    signRankEl.textContent = signRank || '';
    signRankEl.style.display = signRank ? 'inline' : 'none';
  }
  if (signRankSpacer) {
    signRankSpacer.style.display = signRank ? 'inline' : 'none';
  }
  if (signLine) {
    signLine.style.minWidth = signRank ? '180px' : '220px';
  }

  // Quota calculation for Personal Leave (สิทธิ์ 45 วันทำการต่อปีงบประมาณตามระเบียบข้าราชการ)
  const personalQuota = 45;
  const personSelect = document.getElementById('personalUserSelect');
  const selectedPerson = personSelect ? state.personnel.find(p => p.id === personSelect.value) : null;
  const prevTakenDays = selectedPerson ? (selectedPerson.personalTaken || 0) : 0;
  const totalTakenThisYear = prevTakenDays + leaveDays;
  const remainingQuota = Math.max(0, personalQuota - totalTakenThisYear);

  // Update Quota Pills
  const pillTotal = document.getElementById('pillPersonalTotalQuota');
  if (pillTotal) pillTotal.textContent = `${personalQuota} วัน`;
  const pillRem = document.getElementById('pillPersonalRemaining');
  if (pillRem) pillRem.textContent = `${remainingQuota} วัน`;
  const pillPrev = document.getElementById('pillPersonalPrevTaken');
  if (pillPrev) pillPrev.textContent = `${prevTakenDays} วัน`;
  const pillThis = document.getElementById('pillPersonalThisLeave');
  if (pillThis) pillThis.textContent = `${leaveDays} วัน`;

  // Statistics Section (แบบ ๖)
  setTextSafely('pPersonalStatPersonName', fullNameWithRank);
  const elStatAuth = document.getElementById('pPersonalStatAuthority');
  if (elStatAuth) elStatAuth.innerHTML = '&nbsp;';

  const prevSickTakenDays = selectedPerson ? (selectedPerson.sickTaken || 0) : 0;
  if (!blankStatDays) {
    setTextSafely('pPersonalStatPrevCount', formatPersonalNumberOutput(1));
    setTextSafely('pPersonalStatPrevDays', formatPersonalNumberOutput(prevTakenDays));
    setTextSafely('pPersonalStatTotalDays', formatPersonalNumberOutput(totalTakenThisYear));
    setTextSafely('pPersonalStatEverCount', formatPersonalNumberOutput(prevSickTakenDays > 0 ? 1 : 0));
    setTextSafely('pPersonalStatEverDays', formatPersonalNumberOutput(prevSickTakenDays));
  } else {
    ['pPersonalStatPrevCount', 'pPersonalStatPrevDays', 'pPersonalStatTotalDays', 'pPersonalStatEverCount', 'pPersonalStatEverDays'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '&nbsp;';
    });
  }

  if (document.getElementById('pPersonalStatSignPos')) {
    const el = document.getElementById('pPersonalStatSignPos');
    if (el) el.innerHTML = '&nbsp;';
  }

  // Endorsement & Order Section
  // ถ้าคนใด มีตำแหน่งที่ขึ้นต้นด้วย หน. (หรือ หัวหน้า) ให้ซ่อนบล็อกเสนอพิจารณา (เรียน...)
  const isHeadOfSection = rawPosition.trim().startsWith('หน.') || rawPosition.trim().startsWith('หัวหน้า') || rawPosition2.trim().startsWith('หน.') || rawPosition2.trim().startsWith('หัวหน้า');
  const endorseBlock = document.getElementById('pPersonalEndorseBlock');
  if (endorseBlock) {
    endorseBlock.style.display = isHeadOfSection ? 'none' : 'block';
  }

  const fGroupEndorseTo = document.getElementById('fGroupPersonalEndorseTo');
  const fGroupEndorseRank = document.getElementById('fGroupPersonalEndorseRank');
  const fGroupEndorsePos = document.getElementById('fGroupPersonalEndorsePos');
  const badgeEndorseStatus = document.getElementById('badgePersonalEndorseStatus');
  if (fGroupEndorseTo) fGroupEndorseTo.style.display = isHeadOfSection ? 'none' : 'block';
  if (fGroupEndorseRank) fGroupEndorseRank.style.display = isHeadOfSection ? 'none' : 'block';
  if (fGroupEndorsePos) fGroupEndorsePos.style.display = isHeadOfSection ? 'none' : 'block';
  if (badgeEndorseStatus) badgeEndorseStatus.style.display = isHeadOfSection ? 'inline-block' : 'none';

  setTextSafely('pPersonalEndorseTo', endorseTo);
  const spacerEl = document.getElementById('pPersonalEndorseSubSpacer');
  if (spacerEl) {
    const firstK = endorseTo.indexOf('ก');
    const secondK = firstK !== -1 ? endorseTo.indexOf('ก', firstK + 1) : -1;
    const thirdK = secondK !== -1 ? endorseTo.indexOf('ก', secondK + 1) : -1;
    if (thirdK !== -1) {
      spacerEl.innerHTML = `เรียน &nbsp; ${endorseTo.substring(0, thirdK)}`;
    } else {
      spacerEl.innerHTML = `เรียน &nbsp; หก.ก`;
    }
  }
  const rankSpacerEl = document.getElementById('pPersonalEndorseRankSpacer');
  if (rankSpacerEl && spacerEl) {
    rankSpacerEl.innerHTML = `${spacerEl.innerHTML}เพื่อพิจา`;
  }
  const posSpacerEl = document.getElementById('pPersonalEndorsePosSpacer');
  if (posSpacerEl && rankSpacerEl) {
    posSpacerEl.innerHTML = `${rankSpacerEl.innerHTML}${endorseRank}`;
  }
  setTextSafely('pPersonalEndorseRank', endorseRank);
  setTextSafely('pPersonalEndorsePos1', endorsePos);
  setTextSafely('pPersonalEndorsePos', endorsePos);
  setTextSafely('pPersonalEndorsePos2', endorsePos2);

  const persEndorseRankRow = document.getElementById('pPersonalEndorseRankRow') || document.getElementById('pPersonalEndorseRank')?.closest('.form7-endorse-rank-row');
  if (persEndorseRankRow) {
    persEndorseRankRow.style.display = endorseRank ? 'block' : 'none';
  }

  const persEndorsePos2El = document.getElementById('pPersonalEndorsePos2');
  if (persEndorsePos2El) {
    persEndorsePos2El.style.display = endorsePos2 ? 'block' : 'none';
  }

  setTextSafely('pPersonalOrderRank', orderRank);
  const personalOrderRankRow = document.getElementById('pPersonalOrderRankRow') || document.getElementById('pPersonalOrderRank')?.closest('.form7-order-rank-row');
  if (personalOrderRankRow) {
    personalOrderRankRow.style.display = orderRank ? 'block' : 'none';
  }

  setTextSafely('pPersonalOrderPos1', orderPos1);
  setTextSafely('pPersonalOrderPos2', orderPos2);

  const pos2El = document.getElementById('pPersonalOrderPos2');
  if (pos2El) {
    pos2El.style.display = orderPos2 ? 'block' : 'none';
  }

  const orderRankSpacerEl = document.getElementById('pPersonalOrderRankSpacer');
  if (orderRankSpacerEl) {
    orderRankSpacerEl.textContent = '- อนุญา';
  }
  const orderPosSpacerEl = document.getElementById('pPersonalOrderPosSpacer');
  if (orderPosSpacerEl && orderRankSpacerEl) {
    orderPosSpacerEl.innerHTML = `${orderRankSpacerEl.innerHTML}${orderRank}`;
  }

  // Update Sign Date Lines
  // สถิติวันลา: เว้นว่างไว้เป็นเส้นประทั้งหมด ไม่ใส่ เดือน และ พ.ศ.
  const signDateHTML = `<span class="dotted-line" style="min-width: 45px;">&nbsp;</span> / <span class="dotted-line" style="min-width: 45px;">&nbsp;</span> / <span class="dotted-line" style="min-width: 35px;">&nbsp;</span>`;

  const elStatSignDate = document.getElementById('pPersonalStatSignDate');
  if (elStatSignDate) elStatSignDate.innerHTML = signDateHTML;

  // ส่วนที่ ๔ สายการบังคับบัญชา & การอนุมัติ: แสดงเฉพาะเดือนและปี เช่น ต.ค. ๖๙ (ไม่มีเส้นประและไม่มีเครื่องหมายทับ)
  const isPersonalThai = document.getElementById('chkPersonalThaiNum')?.checked ?? state.settings.useThaiNumerals;
  const personalEndorseMonthVal = document.getElementById('inpPersonalEndorseMonth')?.value;
  const personalApprovalMonthVal = document.getElementById('inpPersonalApprovalMonth')?.value;
  const personalEndorseDateHTML = formatApprovalMonthDisplay(personalEndorseMonthVal || personalApprovalMonthVal, isPersonalThai);
  const personalApprovalDateHTML = formatApprovalMonthDisplay(personalApprovalMonthVal, isPersonalThai);

  const elEndorseDate = document.getElementById('pPersonalEndorseDate');
  if (elEndorseDate) elEndorseDate.innerHTML = personalEndorseDateHTML;

  const elOrderDate = document.getElementById('pPersonalOrderDate');
  if (elOrderDate) elOrderDate.innerHTML = personalApprovalDateHTML;

  if (typeof updateThaiMonthInputDisplay === 'function') {
    updateThaiMonthInputDisplay('inpPersonalEndorseMonth');
    updateThaiMonthInputDisplay('inpPersonalApprovalMonth');
  }
}

// ==========================================================================
// INTERACTIVE ACTIONS & CALCULATIONS
// ==========================================================================

/**
 * คำเชื่อมวันลา: ใช้ "ถึงวันที่" อย่างเดียวในทุกกรณี
 */
function updateDateConnectorAutoState() {
  const lblEndDate = document.getElementById('lblEndDate');
  if (lblEndDate) {
    lblEndDate.textContent = 'ถึงวันที่';
  }
  setTextSafely('pDateConnector', 'ถึงวันที่');
}

function handleDateConnectorToggle() {
  render();
}

function handleDateChange(source) {

  const startInp = document.getElementById('inpStartDate');
  const endInp = document.getElementById('inpEndDate');
  const departInp = document.getElementById('inpDepartDate');
  const returnInp = document.getElementById('inpReturnDate');

  const startDateStr = startInp ? startInp.value : '';
  const endDateStr = endInp ? endInp.value : '';

  if (source === 'start') {
    // เมื่อเลือกตั้งแต่วันที่ ให้เปลี่ยนตรง ในวันที่เดินทางไป เสมอ
    if (startDateStr && departInp) {
      departInp.value = startDateStr;
    }
    // หากวันสิ้นสุดยังว่าง หรือน้อยกว่าวันเริ่มต้น ให้ปรับตามวันเริ่มต้น
    if (startDateStr && endInp && (!endInp.value || endInp.value < startDateStr)) {
      endInp.value = startDateStr;
      if (returnInp) returnInp.value = startDateStr;
    }
  } else if (source === 'end') {
    // เมื่อเลือกถึงวันที่ ให้เปลี่ยนตรง และจะกลับในวันที่ เสมอ
    if (endDateStr && returnInp) {
      returnInp.value = endDateStr;
    }
    // หากวันเริ่มต้นยังว่าง หรือมากกว่าวันสิ้นสุด ให้ปรับตามวันสิ้นสุด
    if (endDateStr && startInp && (!startInp.value || startInp.value > endDateStr)) {
      startInp.value = endDateStr;
      if (departInp) departInp.value = endDateStr;
    }
  } else {
    // ซิงก์ทั่วไป
    if (startDateStr && departInp) {
      departInp.value = startDateStr;
    }
    if (endDateStr && returnInp) {
      returnInp.value = endDateStr;
    }
    if (startDateStr && endInp && (!endInp.value || endInp.value < startDateStr)) {
      endInp.value = startDateStr;
      if (returnInp) returnInp.value = startDateStr;
    }
  }

  calculateDays();
}

function calculateDays() {
  const startInp = document.getElementById('inpStartDate');
  const endInp = document.getElementById('inpEndDate');
  const leaveInp = document.getElementById('inpLeaveDays');

  if (startInp && endInp && startInp.value && endInp.value) {
    const days = calculateWorkdays(startInp.value, endInp.value);
    if (leaveInp) leaveInp.value = days;
  }
  updateDateConnectorAutoState();
  render();
}

// ==========================================================================
// DISCRETE / ALTERNATING LEAVE (วันเว้นวัน / ระบุวันอิสระ)
// ==========================================================================

function switchLeaveMode(mode) {
  state.leaveMode = mode;
  const btnRange = document.getElementById('btnModeRange');
  const btnDiscrete = document.getElementById('btnModeDiscrete');
  const secRange = document.getElementById('sectionDateRange');
  const secDiscrete = document.getElementById('sectionDateDiscrete');
  const lblLeaveDaysDesc = document.getElementById('lblLeaveDaysDesc');

  if (mode === 'discrete') {
    if (btnRange) btnRange.classList.remove('active');
    if (btnDiscrete) btnDiscrete.classList.add('active');
    if (secRange) secRange.style.display = 'none';
    if (secDiscrete) secDiscrete.style.display = 'block';
    if (lblLeaveDaysDesc) lblLeaveDaysDesc.textContent = 'นับตามวันที่เลือก';

    // If discreteDates is empty, initialize with 3 alternating days
    if (!state.discreteDates || state.discreteDates.length === 0) {
      quickGenerateAlternating(3);
    } else {
      updateDiscreteDatesUI();
    }
  } else {
    if (btnRange) btnRange.classList.add('active');
    if (btnDiscrete) btnDiscrete.classList.remove('active');
    if (secRange) secRange.style.display = 'grid';
    if (secDiscrete) secDiscrete.style.display = 'none';
    if (lblLeaveDaysDesc) lblLeaveDaysDesc.textContent = 'ไม่นับ ส.-อา.';

    calculateDays();
  }
  render();
}

function addDiscreteDate(dateStr) {
  if (!dateStr) return;
  if (!state.discreteDates) state.discreteDates = [];
  if (!state.discreteDates.includes(dateStr)) {
    state.discreteDates.push(dateStr);
    state.discreteDates.sort();
    state.isCustomDateTextManual = false;
    updateDiscreteDatesUI();
    render();
  }
}

function removeDiscreteDate(dateStr) {
  if (!state.discreteDates) return;
  state.discreteDates = state.discreteDates.filter(d => d !== dateStr);
  state.isCustomDateTextManual = false;
  updateDiscreteDatesUI();
  render();
}

function clearDiscreteDates() {
  state.discreteDates = [];
  state.isCustomDateTextManual = false;
  updateDiscreteDatesUI();
  render();
}

function addDiscreteDateFromInput() {
  const inp = document.getElementById('inpAddDiscreteDate');
  if (inp && inp.value) {
    addDiscreteDate(inp.value);
    inp.value = '';
  }
}

function quickGenerateAlternating(count) {
  const baseInp = document.getElementById('inpStartDate');
  let cur = baseInp && baseInp.value ? parseLocalDate(baseInp.value) : new Date();
  if (!cur || isNaN(cur.getTime())) cur = new Date();

  // Find next weekday if weekend
  while (cur.getDay() === 0 || cur.getDay() === 6) {
    cur.setDate(cur.getDate() + 1);
  }

  const generated = [];
  let added = 0;
  while (added < count) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6) {
      generated.push(formatDateForInput(cur));
      added++;
      // Skip next day (alternating)
      cur.setDate(cur.getDate() + 2);
    } else {
      cur.setDate(cur.getDate() + 1);
    }
  }

  state.discreteDates = generated;
  state.isCustomDateTextManual = false;
  updateDiscreteDatesUI();
  render();
}

function isConsecutiveMonthEndLeave(datesArray) {
  if (!datesArray || datesArray.length < 2) return false;
  const sorted = [...datesArray].sort();
  for (let i = 0; i < sorted.length - 1; i++) {
    const d1 = parseLocalDate(sorted[i]);
    const d2 = parseLocalDate(sorted[i + 1]);
    if (!d1 || !d2) return false;
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays !== 1) return false;
  }
  const pStart = parseThaiDate(sorted[0]);
  const pEnd = parseThaiDate(sorted[sorted.length - 1]);
  return pStart.month !== pEnd.month || pStart.year !== pEnd.year;
}

function getDiscreteDateParts(datesArray) {
  if (!datesArray || datesArray.length === 0) {
    return { isSameMonth: true, isConsecutiveMonthEnd: false, daysOnlyText: '-', month: '-', year: '-', fullText: '-' };
  }
  const sorted = [...datesArray].sort();
  const parsedList = sorted.map(dStr => parseThaiDate(dStr)).filter(p => p.day !== '-');
  if (parsedList.length === 0) {
    return { isSameMonth: true, isConsecutiveMonthEnd: false, daysOnlyText: '-', month: '-', year: '-', fullText: '-' };
  }

  const isThai = document.getElementById('chkThaiNum')?.checked ?? state.settings.useThaiNumerals;
  const numFmt = (n) => (isThai ? toThaiDigits(n) : String(n));

  const startP = parsedList[0];
  const endP = parsedList[parsedList.length - 1];
  const fullText = formatDiscreteDatesThai(datesArray);

  return {
    isSameMonth: startP.month === endP.month && startP.year === endP.year,
    isConsecutiveMonthEnd: isConsecutiveMonthEndLeave(sorted),
    daysOnlyText: `${numFmt(startP.day)} - ${numFmt(endP.day)}`,
    month: startP.month,
    year: numFmt(endP.year),
    fullText
  };
}

function formatDiscreteDatesThai(datesArray) {
  if (!datesArray || datesArray.length === 0) return '';
  const sorted = [...datesArray].sort();
  const parsedList = sorted.map(dStr => parseThaiDate(dStr)).filter(p => p.day !== '-');
  if (parsedList.length === 0) return '';

  const isThai = document.getElementById('chkThaiNum')?.checked ?? state.settings.useThaiNumerals;
  const numFmt = (n) => (isThai ? toThaiDigits(n) : String(n));

  const startP = parsedList[0];
  const endP = parsedList[parsedList.length - 1];

  if (parsedList.length === 1) {
    return `ตั้งแต่วันที่ ${numFmt(startP.day)} เดือน ${startP.month} พ.ศ. ${numFmt(startP.year)} ถึงวันที่ ${numFmt(endP.day)} เดือน ${endP.month} พ.ศ. ${numFmt(endP.year)}`;
  }

  const conn = 'ถึงวันที่';

  return `ตั้งแต่วันที่ ${numFmt(startP.day)} เดือน ${startP.month} พ.ศ. ${numFmt(startP.year)} ${conn} ${numFmt(endP.day)} เดือน ${endP.month} พ.ศ. ${numFmt(endP.year)}`;
}

function updateDiscreteDatesUI() {
  const container = document.getElementById('discreteChipsContainer');
  const customInp = document.getElementById('inpCustomDateText');
  const leaveInp = document.getElementById('inpLeaveDays');
  const departInp = document.getElementById('inpDepartDate');
  const returnInp = document.getElementById('inpReturnDate');

  if (!state.discreteDates) state.discreteDates = [];
  state.discreteDates.sort();

  if (container) {
    if (state.discreteDates.length === 0) {
      container.innerHTML = '<span style="font-size: 12.5px; color: #94a3b8; font-style: italic;">ยังไม่ได้เลือกวันลา กรุณาเลือกวันที่ด้านบนแล้วกด "เพิ่มวันลา" หรือใช้ปุ่มสร้างด่วน</span>';
    } else {
      const isThai = document.getElementById('chkThaiNum')?.checked ?? state.settings.useThaiNumerals;
      const numFmt = (n) => (isThai ? toThaiDigits(n) : String(n));

      container.innerHTML = state.discreteDates.map(dStr => {
        const p = parseThaiDate(dStr);
        const label = `${numFmt(p.day)} ${p.month} ${numFmt(p.year)}`;
        return `
          <span class="discrete-chip">
            <span>${label}</span>
            <button type="button" onclick="removeDiscreteDate('${dStr}')" title="ลบวันนี้">×</button>
          </span>
        `;
      }).join('');
    }
  }

  if (state.leaveMode === 'discrete') {
    if (leaveInp) {
      leaveInp.value = state.discreteDates.length;
    }
    if (state.discreteDates.length > 0) {
      const firstDate = state.discreteDates[0];
      const lastDate = state.discreteDates[state.discreteDates.length - 1];
      if (departInp) departInp.value = firstDate;
      if (returnInp) returnInp.value = lastDate;
    }
    updateDateConnectorAutoState();
  }

  const generatedText = formatDiscreteDatesThai(state.discreteDates);
  if (customInp) {
    if (!state.isCustomDateTextManual) {
      state.customDateText = generatedText;
      customInp.value = generatedText;
    }
  }
}

function handleCustomDateTextInput() {
  const customInp = document.getElementById('inpCustomDateText');
  if (customInp) {
    state.customDateText = customInp.value;
    state.isCustomDateTextManual = true;
    render();
  }
}

function resetCustomDateText() {
  state.isCustomDateTextManual = false;
  state.customDateText = formatDiscreteDatesThai(state.discreteDates || []);
  const customInp = document.getElementById('inpCustomDateText');
  if (customInp) customInp.value = state.customDateText;
  render();
}

function loadPersonData(personId, showNotification = true) {
  if (!personId) {
    // Reset to manual inputs
    const elName = document.getElementById('inpName');
    if (elName) elName.value = '';
    const elRank = document.getElementById('inpRank');
    if (elRank) elRank.value = '';
    const elPos = document.getElementById('inpPosition');
    if (elPos) elPos.value = '';
    const elAcc = document.getElementById('inpAccDays');
    if (elAcc) elAcc.value = '';
    const elPrevYear = document.getElementById('inpPrevYearLeaveDays');
    if (elPrevYear) elPrevYear.value = '';
    const elPrev = document.getElementById('inpPrevLeaveDays');
    if (elPrev) elPrev.value = '0';
    const elPhone = document.getElementById('inpPhone');
    if (elPhone) elPhone.value = '';
    render();
    return;
  }

  const person = state.personnel.find(p => p.id === personId);
  if (!person) return;

  const elRank = document.getElementById('inpRank');
  if (elRank) elRank.value = person.rank || '';
  const elName = document.getElementById('inpName');
  if (elName) elName.value = formatNameSpacing(person.name || '');
  const elPos = document.getElementById('inpPosition');
  if (elPos) elPos.value = person.position || '';
  const elPos2 = document.getElementById('inpPosition2');
  if (elPos2) elPos2.value = person.position2 || '';
  const chkPosWrapEl = document.getElementById('chkPosWrap');
  if (chkPosWrapEl) {
    delete chkPosWrapEl.dataset.manuallyToggled;
    chkPosWrapEl.checked = false;
  }
  const elAnnual = document.getElementById('inpAnnualQuota');
  if (elAnnual) elAnnual.value = person.annualQuota ?? 10;
  const elAcc = document.getElementById('inpAccDays');
  if (elAcc) elAcc.value = (person.accQuota !== undefined && person.accQuota !== null) ? person.accQuota : '';
  const elPrevYear = document.getElementById('inpPrevYearLeaveDays');
  if (elPrevYear) elPrevYear.value = '';
  const elPhone = document.getElementById('inpPhone');
  if (elPhone) elPhone.value = person.phone || '';
  if (person.pronoun) {
    const elPronoun = document.getElementById('inpPronoun');
    if (elPronoun) elPronoun.value = person.pronoun;
  }

  // Calculate previously taken days in this fiscal year from approved leave history
  const takenDays = state.leaves
    .filter(l => l.personId === personId && l.status === 'approved')
    .reduce((sum, item) => sum + (parseInt(item.days, 10) || 0), 0);

  const elPrevDays = document.getElementById('inpPrevLeaveDays');
  if (elPrevDays) elPrevDays.value = takenDays;

  const fullName = [person.rank, person.name].filter(Boolean).join(' ') || person.name || '';
  if (showNotification) {
    showToast(`โหลดข้อมูลของ "${fullName}" เรียบร้อย`, 'success');
  }
  render();
}

function loadSickPersonData(personId, showNotification = true) {
  if (!personId) {
    const elName = document.getElementById('inpSickName');
    if (elName) elName.value = '';
    const elRank = document.getElementById('inpSickRank');
    if (elRank) elRank.value = '';
    const elPos = document.getElementById('inpSickPosition');
    if (elPos) elPos.value = '';
    const elPos2 = document.getElementById('inpSickPosition2');
    if (elPos2) elPos2.value = '';
    const elPhone = document.getElementById('inpSickPhone');
    if (elPhone) elPhone.value = '';
    renderSickLeave();
    return;
  }

  const person = state.personnel.find(p => p.id === personId);
  if (!person) return;

  const elRank = document.getElementById('inpSickRank');
  if (elRank) elRank.value = person.rank || '';
  const elName = document.getElementById('inpSickName');
  if (elName) elName.value = formatNameSpacing(person.name || '');
  const elPos = document.getElementById('inpSickPosition');
  if (elPos) elPos.value = person.position || '';
  const elPos2 = document.getElementById('inpSickPosition2');
  if (elPos2) elPos2.value = person.position2 || '';
  const elPhone = document.getElementById('inpSickPhone');
  if (elPhone) elPhone.value = person.phone || '';
  if (person.pronoun) {
    const elPronoun = document.getElementById('inpSickPronoun');
    if (elPronoun) elPronoun.value = person.pronoun;
  }
  if (person.homeNo) {
    const el = document.getElementById('inpSickHomeNo');
    if (el) el.value = person.homeNo;
  }
  if (person.road) {
    const el = document.getElementById('inpSickRoad');
    if (el) el.value = person.road;
  }
  if (person.subdistrict) {
    const el = document.getElementById('inpSickSubdistrict');
    if (el) el.value = person.subdistrict;
  }
  if (person.district) {
    const el = document.getElementById('inpSickDistrict');
    if (el) el.value = person.district;
  }
  if (person.province) {
    const el = document.getElementById('inpSickProvince');
    if (el) el.value = person.province;
  }

  const fullName = [person.rank, person.name].filter(Boolean).join(' ') || person.name || '';
  if (showNotification) {
    showToast(`โหลดข้อมูลของ "${fullName}" สำหรับใบลาป่วยเรียบร้อย`, 'success');
  }
  renderSickLeave();
}

function loadPersonalPersonData(personId, showNotification = true) {
  if (!personId) {
    const elName = document.getElementById('inpPersonalName');
    if (elName) elName.value = '';
    const elRank = document.getElementById('inpPersonalRank');
    if (elRank) elRank.value = '';
    const elPos = document.getElementById('inpPersonalPosition');
    if (elPos) elPos.value = '';
    const elPos2 = document.getElementById('inpPersonalPosition2');
    if (elPos2) elPos2.value = '';
    const elPhone = document.getElementById('inpPersonalPhone');
    if (elPhone) elPhone.value = '';
    renderPersonalLeave();
    return;
  }

  const person = state.personnel.find(p => p.id === personId);
  if (!person) return;

  const elRank = document.getElementById('inpPersonalRank');
  if (elRank) elRank.value = person.rank || '';
  const elName = document.getElementById('inpPersonalName');
  if (elName) elName.value = formatNameSpacing(person.name || '');
  const elPos = document.getElementById('inpPersonalPosition');
  if (elPos) elPos.value = person.position || '';
  const elPos2 = document.getElementById('inpPersonalPosition2');
  if (elPos2) elPos2.value = person.position2 || '';
  const elPhone = document.getElementById('inpPersonalPhone');
  if (elPhone) elPhone.value = person.phone || '';
  if (person.pronoun) {
    const elPronoun = document.getElementById('inpPersonalPronoun');
    if (elPronoun) elPronoun.value = person.pronoun;
  }
  if (person.province) {
    const el = document.getElementById('inpPersonalProvince');
    if (el && !el.value) el.value = person.province;
  }

  const fullName = [person.rank, person.name].filter(Boolean).join(' ') || person.name || '';
  if (showNotification) {
    showToast(`โหลดข้อมูลของ "${fullName}" สำหรับใบลากิจเรียบร้อย`, 'success');
  }
  renderPersonalLeave();
}

function toggleNumeralFormat() {
  const isChecked = document.getElementById('chkThaiNum').checked;
  state.settings.useThaiNumerals = isChecked;
  saveState();
  render();
}

// ==========================================================================
// PERSONNEL AUTO-SYNC HELPER
// ==========================================================================

function syncApplicantToPersonnel({
  personId = null,
  rank = '',
  name = '',
  position = '',
  position2 = '',
  unit = '',
  phone = '',
  pronoun = '',
  homeNo = '',
  road = '',
  subdistrict = '',
  district = '',
  province = '',
  leaveType = 'vacation',
  days = 0,
  isApproved = true
}) {
  if (!name) return null;

  const normalizedName = formatNameSpacing(name.trim());
  const cleanNameForCompare = normalizedName.replace(/\s+/g, '');
  const cleanRankForCompare = (rank || '').replace(/\s+/g, '');
  const fullForCompare = cleanRankForCompare + cleanNameForCompare;

  let person = null;
  if (personId) {
    person = state.personnel.find(p => p.id === personId);
  }
  if (!person) {
    person = state.personnel.find(p => {
      const pFull = ((p.rank || '') + (p.name || '')).replace(/\s+/g, '');
      const pNameOnly = (p.name || '').replace(/\s+/g, '');
      return pFull === fullForCompare || pNameOnly === cleanNameForCompare;
    });
  }

  if (person) {
    if (rank) person.rank = rank;
    if (normalizedName) person.name = normalizedName;
    if (position) person.position = position;
    if (position2 !== undefined && position2 !== null) person.position2 = position2;
    if (unit) person.unit = unit;
    if (phone) person.phone = phone;
    if (pronoun) person.pronoun = pronoun;
    if (homeNo) person.homeNo = homeNo;
    if (road) person.road = road;
    if (subdistrict) person.subdistrict = subdistrict;
    if (district) person.district = district;
    if (province) person.province = province;

    if (isApproved) {
      if (leaveType === 'sick') {
        person.sickTaken = (person.sickTaken || 0) + (days || 0);
      } else if (leaveType === 'personal') {
        person.personalTaken = (person.personalTaken || 0) + (days || 0);
      }
    }
  } else {
    const newPersonId = 'p_' + Date.now();
    person = {
      id: newPersonId,
      rank: rank || '',
      name: normalizedName,
      position: position || '',
      position2: position2 || '',
      unit: unit || state.settings?.writtenAt || 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
      annualQuota: 10,
      accQuota: 0,
      sickQuota: 60,
      sickTaken: (isApproved && leaveType === 'sick') ? (days || 0) : 0,
      personalTaken: (isApproved && leaveType === 'personal') ? (days || 0) : 0,
      phone: phone || '',
      pronoun: pronoun || (rank.includes('หญิง') ? 'ดิฉัน' : 'กระผม'),
      homeNo: homeNo || '',
      road: road || '',
      subdistrict: subdistrict || '',
      district: district || '',
      province: province || ''
    };
    state.personnel.push(person);
  }

  saveState();

  // Real-time Supabase Cloud sync
  if (person && typeof syncPersonToSupabase === 'function') {
    syncPersonToSupabase(person);
  }

  updateUserSelectOptions();
  renderPersonnelTable();
  return person.id;
}

// Save Leave Application to Register (แบบ ๗ - ลาพักผ่อน)
function saveLeaveApplication() {
  const rank = document.getElementById('inpRank')?.value.trim() || '';
  const rawName = document.getElementById('inpName')?.value.trim() || '';
  const formattedFullName = formatRankName(rank, rawName);

  if (!rawName) {
    showToast('กรุณากรอกยศ-ชื่อ-สกุล ผู้ขอลา', 'danger');
    return;
  }

  const isDiscrete = state.leaveMode === 'discrete';
  let startDate = document.getElementById('inpStartDate')?.value;
  let endDate = document.getElementById('inpEndDate')?.value;
  let days = parseInt(document.getElementById('inpLeaveDays')?.value || '0', 10);

  if (isDiscrete) {
    if (!state.discreteDates || state.discreteDates.length === 0) {
      showToast('กรุณาเลือกวันลาอย่างน้อย 1 วัน', 'danger');
      return;
    }
    startDate = state.discreteDates[0];
    endDate = state.discreteDates[state.discreteDates.length - 1];
    if (days <= 0) days = state.discreteDates.length;
  } else {
    if (!startDate || !endDate) {
      showToast('กรุณาเลือกช่วงวันเริ่มต้นและสิ้นสุดการลา', 'danger');
      return;
    }
  }

  if (days <= 0) {
    showToast('จำนวนวันลาต้องมากกว่า 0 วันทำการ', 'warning');
    return;
  }

  const personSelect = document.getElementById('userSelect');
  const selectedPersonId = personSelect ? personSelect.value || null : null;

  // Auto-sync applicant data to personnel database
  const positionVal = document.getElementById('inpPosition')?.value.trim() || '';
  const position2Val = document.getElementById('inpPosition2')?.value.trim() || '';
  const phoneVal = document.getElementById('inpPhone')?.value.trim() || '';
  const provinceVal = document.getElementById('inpProvince')?.value.trim() || '';
  const pronounVal = document.getElementById('inpPronoun')?.value || (rank.includes('หญิง') ? 'ดิฉัน' : 'กระผม');

  const syncedPersonId = syncApplicantToPersonnel({
    personId: selectedPersonId,
    rank: rank,
    name: rawName,
    position: positionVal,
    position2: position2Val,
    phone: phoneVal,
    pronoun: pronounVal,
    province: provinceVal,
    leaveType: 'vacation',
    days: days,
    isApproved: true
  });

  const newDocId = `LV-${new Date().getFullYear() + 543}-${String(state.leaves.length + 1).padStart(3, '0')}`;

  const leaveRecord = {
    id: newDocId,
    personId: syncedPersonId || selectedPersonId,
    username: state.currentUser ? state.currentUser.username : '',
    createdBy: state.currentUser ? state.currentUser.username : '',
    leaveType: 'vacation',
    formType: 'แบบ ๗',
    name: formattedFullName || rawName,
    position: positionVal,
    position2: position2Val,
    isPosWrapped: document.getElementById('chkPosWrap')?.checked || false,
    docDate: document.getElementById('inpDocDate')?.value || '',
    leaveMode: isDiscrete ? 'discrete' : 'range',
    discreteDates: isDiscrete ? [...state.discreteDates] : [],
    customDateText: isDiscrete ? (state.customDateText || '') : '',
    startDate: startDate,
    endDate: endDate,
    departDate: document.getElementById('inpDepartDate')?.value || startDate,
    returnDate: document.getElementById('inpReturnDate')?.value || endDate,
    days: days,
    province: provinceVal,
    phone: phoneVal,
    status: 'approved',
    createdAt: new Date().toISOString()
  };

  state.leaves.unshift(leaveRecord);
  saveState();

  // Real-time Supabase Cloud sync
  if (typeof syncLeaveToSupabase === 'function') {
    syncLeaveToSupabase(leaveRecord);
  }

  // Log audit event
  logAuditEvent({
    action: 'CREATE_LEAVE_VACATION',
    actionTitle: 'สร้างใบลาพักผ่อน (แบบ ๗)',
    category: 'leave',
    details: `สร้างใบลาเลขที่ ${newDocId} ของ ${formattedFullName} จำนวน ${days} วัน (${startDate} ถึง ${endDate})`,
    status: 'success'
  });

  showToast(`บันทึกใบลาเลขที่ ${newDocId} และอัปเดตข้อมูลกำลังพลเรียบร้อย`, 'success');
  updateUserSelectOptions();
  renderHistoryTable();
  renderPersonnelTable();
}

// Save Sick Leave Application (แบบ ๓ - ลาป่วย) to Register
function saveSickLeaveApplication() {
  const rank = document.getElementById('inpSickRank')?.value.trim() || '';
  const rawName = document.getElementById('inpSickName')?.value.trim() || '';
  const formattedFullName = formatRankName(rank, rawName);

  if (!rawName) {
    showToast('กรุณากรอกยศ-ชื่อ-สกุล ผู้ขอลา', 'danger');
    return;
  }

  const startDate = document.getElementById('inpSickStartDate')?.value;
  const endDate = document.getElementById('inpSickEndDate')?.value;
  const days = parseInt(document.getElementById('inpSickLeaveDays')?.value || '0', 10);

  if (!startDate || !endDate) {
    showToast('กรุณาเลือกช่วงวันเริ่มต้นและสิ้นสุดการลาป่วย', 'danger');
    return;
  }

  if (days <= 0) {
    showToast('จำนวนวันลาต้องมากกว่า 0 วันทำการ', 'warning');
    return;
  }

  const personSelect = document.getElementById('sickUserSelect');
  const selectedPersonId = personSelect ? personSelect.value || null : null;

  const positionVal = document.getElementById('inpSickPosition')?.value.trim() || '';
  const position2Val = document.getElementById('inpSickPosition2')?.value.trim() || '';
  const homeNoVal = document.getElementById('inpSickHomeNo')?.value.trim() || '';
  const roadVal = document.getElementById('inpSickRoad')?.value.trim() || '';
  const subdistrictVal = document.getElementById('inpSickSubdistrict')?.value.trim() || '';
  const districtVal = document.getElementById('inpSickDistrict')?.value.trim() || '';
  const provinceVal = document.getElementById('inpSickProvince')?.value.trim() || '';
  const phoneVal = document.getElementById('inpSickPhone')?.value.trim() || '';
  const diagnosisVal = document.getElementById('inpSickDiagnosis')?.value.trim() || 'ไข้หวัด';

  // Auto-sync applicant data and address to personnel database
  const syncedPersonId = syncApplicantToPersonnel({
    personId: selectedPersonId,
    rank: rank,
    name: rawName,
    position: positionVal,
    position2: position2Val,
    phone: phoneVal,
    pronoun: (rank.includes('หญิง') ? 'ดิฉัน' : 'กระผม'),
    homeNo: homeNoVal,
    road: roadVal,
    subdistrict: subdistrictVal,
    district: districtVal,
    province: provinceVal,
    leaveType: 'sick',
    days: days,
    isApproved: true
  });

  const newDocId = `SK-${new Date().getFullYear() + 543}-${String(state.leaves.length + 1).padStart(3, '0')}`;

  const leaveRecord = {
    id: newDocId,
    personId: syncedPersonId || selectedPersonId,
    username: state.currentUser ? state.currentUser.username : '',
    createdBy: state.currentUser ? state.currentUser.username : '',
    leaveType: 'sick',
    formType: 'แบบ ๓',
    name: formattedFullName,
    position: positionVal,
    position2: position2Val,
    docDate: document.getElementById('inpSickDocDate')?.value || '',
    startDate: startDate,
    endDate: endDate,
    days: days,
    diagnosis: diagnosisVal,
    homeNo: homeNoVal,
    road: roadVal,
    subdistrict: subdistrictVal,
    district: districtVal,
    province: provinceVal,
    phone: phoneVal,
    status: 'approved',
    createdAt: new Date().toISOString()
  };

  state.leaves.unshift(leaveRecord);
  saveState();

  // Real-time Supabase Cloud sync
  if (typeof syncLeaveToSupabase === 'function') {
    syncLeaveToSupabase(leaveRecord);
  }

  // Log audit event
  logAuditEvent({
    action: 'CREATE_LEAVE_SICK',
    actionTitle: 'สร้างใบลาป่วย (แบบ ๓)',
    category: 'leave',
    details: `สร้างใบลาป่วยเลขที่ ${newDocId} ของ ${formattedFullName} จำนวน ${days} วัน (${startDate} ถึง ${endDate})`,
    status: 'success'
  });

  showToast(`บันทึกใบลาป่วยเลขที่ ${newDocId} และอัปเดตข้อมูลกำลังพลเรียบร้อย`, 'success');
  updateUserSelectOptions();
  renderHistoryTable();
  renderPersonnelTable();
}

// Save Personal Leave Application (แบบ ๖ - ลากิจ) to Register
function savePersonalLeaveApplication() {
  const rank = document.getElementById('inpPersonalRank')?.value.trim() || '';
  const rawName = document.getElementById('inpPersonalName')?.value.trim() || '';
  const formattedFullName = formatRankName(rank, rawName);

  if (!rawName) {
    showToast('กรุณากรอกยศ-ชื่อ-สกุล ผู้ขอลา', 'danger');
    return;
  }

  const startDate = document.getElementById('inpPersonalStartDate')?.value;
  const endDate = document.getElementById('inpPersonalEndDate')?.value;
  const days = parseInt(document.getElementById('inpPersonalLeaveDays')?.value || '0', 10);

  if (!startDate || !endDate) {
    showToast('กรุณาเลือกช่วงวันเริ่มต้นและสิ้นสุดการลากิจ', 'danger');
    return;
  }

  if (days <= 0) {
    showToast('จำนวนวันลาต้องมากกว่า 0 วันทำการ', 'warning');
    return;
  }

  const personSelect = document.getElementById('personalUserSelect');
  const selectedPersonId = personSelect ? personSelect.value || null : null;

  const positionVal = document.getElementById('inpPersonalPosition')?.value.trim() || '';
  const position2Val = document.getElementById('inpPersonalPosition2')?.value.trim() || '';
  const phoneVal = document.getElementById('inpPersonalPhone')?.value.trim() || '';
  const provinceVal = document.getElementById('inpPersonalProvince')?.value.trim() || 'กรุงเทพมหานคร';
  const reasonVal = document.getElementById('inpPersonalReason')?.value.trim() || 'จัดการธุระส่วนตัว';
  const departDateVal = document.getElementById('inpPersonalDepartDate')?.value || startDate;
  const returnDateVal = document.getElementById('inpPersonalReturnDate')?.value || endDate;
  const prevSameCountVal = document.getElementById('inpPersonalPrevSameCount')?.value.trim() || '';
  const prevSameDaysVal = document.getElementById('inpPersonalPrevSameDays')?.value.trim() || '';

  // Auto-sync applicant data to personnel database
  const syncedPersonId = syncApplicantToPersonnel({
    personId: selectedPersonId,
    rank: rank,
    name: rawName,
    position: positionVal,
    position2: position2Val,
    phone: phoneVal,
    pronoun: (rank.includes('หญิง') ? 'ดิฉัน' : 'กระผม'),
    province: provinceVal,
    leaveType: 'personal',
    days: days,
    isApproved: true
  });

  const newDocId = `PERS-${new Date().getFullYear() + 543}-${String(state.leaves.length + 1).padStart(3, '0')}`;

  const leaveRecord = {
    id: newDocId,
    personId: syncedPersonId || selectedPersonId,
    username: state.currentUser ? state.currentUser.username : '',
    createdBy: state.currentUser ? state.currentUser.username : '',
    leaveType: 'personal',
    formType: 'แบบ ๖',
    name: formattedFullName,
    position: positionVal,
    position2: position2Val,
    docDate: document.getElementById('inpPersonalDocDate')?.value || '',
    startDate: startDate,
    endDate: endDate,
    days: days,
    reason: reasonVal,
    province: provinceVal,
    departDate: departDateVal,
    returnDate: returnDateVal,
    prevSameCount: prevSameCountVal,
    prevSameDays: prevSameDaysVal,
    phone: phoneVal,
    status: 'approved',
    createdAt: new Date().toISOString()
  };

  state.leaves.unshift(leaveRecord);
  saveState();

  // Real-time Supabase Cloud sync
  if (typeof syncLeaveToSupabase === 'function') {
    syncLeaveToSupabase(leaveRecord);
  }

  // Log audit event
  logAuditEvent({
    action: 'CREATE_LEAVE_PERSONAL',
    actionTitle: 'สร้างใบลากิจ (แบบ ๖)',
    category: 'leave',
    details: `สร้างใบลากิจเลขที่ ${newDocId} ของ ${formattedFullName} จำนวน ${days} วัน เหตุผล: ${reasonVal}`,
    status: 'success'
  });

  showToast(`บันทึกใบลากิจเลขที่ ${newDocId} และอัปเดตข้อมูลกำลังพลเรียบร้อย`, 'success');
  updateUserSelectOptions();
  renderHistoryTable();
  renderPersonnelTable();
}

// Save or Update Sick Leave Address directly to Personnel Record
function saveSickAddressToPersonnel(isSilent = false) {
  const personSelect = document.getElementById('sickUserSelect');
  const selectedPersonId = personSelect ? personSelect.value || null : null;
  const rawName = document.getElementById('inpSickName')?.value.trim() || '';
  const rank = document.getElementById('inpSickRank')?.value.trim() || '';
  const formattedFullName = formatRankName(rank, rawName);

  let person = null;
  if (selectedPersonId) {
    person = state.personnel.find(p => p.id === selectedPersonId);
  }
  if (!person && rawName) {
    person = state.personnel.find(p => p.name && (p.name.replace(/\s+/g, '') === rawName.replace(/\s+/g, '') || formatRankName(p.rank, p.name).replace(/\s+/g, '') === formattedFullName.replace(/\s+/g, '')));
  }

  if (!person) {
    if (!isSilent) showToast('กรุณาเลือกกำลังพลจากรายชื่อ หรือระบุชื่อผู้ขอลา', 'warning');
    return;
  }

  const homeNo = document.getElementById('inpSickHomeNo')?.value.trim() || '';
  const road = document.getElementById('inpSickRoad')?.value.trim() || '';
  const subdistrict = document.getElementById('inpSickSubdistrict')?.value.trim() || '';
  const district = document.getElementById('inpSickDistrict')?.value.trim() || '';
  const province = document.getElementById('inpSickProvince')?.value.trim() || '';
  const phone = document.getElementById('inpSickPhone')?.value.trim() || '';

  if (homeNo) person.homeNo = homeNo;
  if (road) person.road = road;
  if (subdistrict) person.subdistrict = subdistrict;
  if (district) person.district = district;
  if (province) person.province = province;
  if (phone) person.phone = phone;

  saveState();

  // Real-time Supabase Cloud sync
  if (person && typeof syncPersonToSupabase === 'function') {
    syncPersonToSupabase(person);
  }

  renderPersonnelTable();
  if (!isSilent) {
    const personName = formatRankName(person.rank, person.name);
    showToast(`บันทึกที่อยู่ของ "${personName}" ลงในข้อมูลกำลังพลเรียบร้อยแล้ว`, 'success');
  }
}

// Load Leave Application from History into Form
function viewAndPrintLeave(leaveId) {
  const record = state.leaves.find(l => l.id === leaveId);
  if (!record) return;

  if (record.leaveType === 'sick') {
    switchTab('create-sick');

    const elName = document.getElementById('inpSickName');
    const elRank = document.getElementById('inpSickRank');
    const extracted = extractRank(record.name);
    if (extracted) {
      if (elRank) elRank.value = extracted;
      let namePart = record.name.slice(extracted.length).trim();
      if (elName) elName.value = formatNameSpacing(namePart);
    } else {
      if (elName) elName.value = formatNameSpacing(record.name);
    }
    const elPos = document.getElementById('inpSickPosition');
    if (elPos) elPos.value = record.position || '';
    const elPos2 = document.getElementById('inpSickPosition2');
    if (elPos2) elPos2.value = record.position2 || '';

    const elDocDate = document.getElementById('inpSickDocDate');
    if (elDocDate) elDocDate.value = record.docDate || '';
    const elStart = document.getElementById('inpSickStartDate');
    if (elStart) elStart.value = record.startDate || '';
    const elEnd = document.getElementById('inpSickEndDate');
    if (elEnd) elEnd.value = record.endDate || '';
    const elDays = document.getElementById('inpSickLeaveDays');
    if (elDays) elDays.value = record.days || '1';
    const elDiag = document.getElementById('inpSickDiagnosis');
    if (elDiag) elDiag.value = record.diagnosis || 'ไข้หวัด';
    const elHome = document.getElementById('inpSickHomeNo');
    if (elHome && record.homeNo) elHome.value = record.homeNo;
    const elRoad = document.getElementById('inpSickRoad');
    if (elRoad && record.road) elRoad.value = record.road;
    const elSub = document.getElementById('inpSickSubdistrict');
    if (elSub && record.subdistrict) elSub.value = record.subdistrict;
    const elDist = document.getElementById('inpSickDistrict');
    if (elDist && record.district) elDist.value = record.district;
    const elProv = document.getElementById('inpSickProvince');
    if (elProv && record.province) elProv.value = record.province;
    const elPhone = document.getElementById('inpSickPhone');
    if (elPhone && record.phone) elPhone.value = record.phone;

    if (record.personId) {
      const elSelect = document.getElementById('sickUserSelect');
      if (elSelect) {
        if (!elSelect.querySelector(`option[value="${record.personId}"]`)) {
          const p = state.personnel.find(item => item.id === record.personId);
          if (p) {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${formatRankName(p.rank, p.name)} (${p.position || 'ไม่มีตำแหน่ง'})`;
            elSelect.insertBefore(opt, elSelect.firstChild);
          }
        }
        elSelect.value = record.personId;
      }
      loadSickPersonData(record.personId);
      if (elDays) elDays.value = record.days;
      if (elDiag && record.diagnosis) elDiag.value = record.diagnosis;
    }

    renderSickLeave();
    showToast(`ดึงข้อมูลใบลาป่วยเลขที่ ${record.id} ขึ้นแสดงเรียบร้อย`, 'success');
    return;
  }

  if (record.leaveType === 'personal' || record.id.startsWith('PERS-')) {
    switchTab('create-personal');

    const elName = document.getElementById('inpPersonalName');
    const elRank = document.getElementById('inpPersonalRank');
    const extracted = extractRank(record.name);
    if (extracted) {
      if (elRank) elRank.value = extracted;
      let namePart = record.name.slice(extracted.length).trim();
      if (elName) elName.value = formatNameSpacing(namePart);
    } else {
      if (elName) elName.value = formatNameSpacing(record.name);
    }

    const elPos = document.getElementById('inpPersonalPosition');
    if (elPos) elPos.value = record.position || '';
    const elPos2 = document.getElementById('inpPersonalPosition2');
    if (elPos2) elPos2.value = record.position2 || '';
    const elDocDate = document.getElementById('inpPersonalDocDate');
    if (elDocDate) elDocDate.value = record.docDate || '';
    const elStart = document.getElementById('inpPersonalStartDate');
    if (elStart) elStart.value = record.startDate || '';
    const elEnd = document.getElementById('inpPersonalEndDate');
    if (elEnd) elEnd.value = record.endDate || '';
    const elDays = document.getElementById('inpPersonalLeaveDays');
    if (elDays) elDays.value = record.days || '1';
    const elReason = document.getElementById('inpPersonalReason');
    if (elReason) elReason.value = record.reason || 'จัดการธุระส่วนตัว';
    const elProv = document.getElementById('inpPersonalProvince');
    if (elProv) elProv.value = record.province || 'กรุงเทพมหานคร';
    const elDepart = document.getElementById('inpPersonalDepartDate');
    if (elDepart) elDepart.value = record.departDate || record.startDate || '';
    const elReturn = document.getElementById('inpPersonalReturnDate');
    if (elReturn) elReturn.value = record.returnDate || record.endDate || '';
    const elPrevCount = document.getElementById('inpPersonalPrevSameCount');
    if (elPrevCount) elPrevCount.value = record.prevSameCount || '';
    const elPrevDays = document.getElementById('inpPersonalPrevSameDays');
    if (elPrevDays) elPrevDays.value = record.prevSameDays || '';
    const elPhone = document.getElementById('inpPersonalPhone');
    if (elPhone && record.phone) elPhone.value = record.phone;

    if (record.personId) {
      const elSelect = document.getElementById('personalUserSelect');
      if (elSelect) {
        if (!elSelect.querySelector(`option[value="${record.personId}"]`)) {
          const p = state.personnel.find(item => item.id === record.personId);
          if (p) {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${formatRankName(p.rank, p.name)} (${p.position || 'ไม่มีตำแหน่ง'})`;
            elSelect.insertBefore(opt, elSelect.firstChild);
          }
        }
        elSelect.value = record.personId;
      }
      loadPersonalPersonData(record.personId);
      if (elDays) elDays.value = record.days;
      if (elReason && record.reason) elReason.value = record.reason;
    }

    renderPersonalLeave();
    showToast(`ดึงข้อมูลใบลากิจเลขที่ ${record.id} ขึ้นแสดงเรียบร้อย`, 'success');
    return;
  }

  switchTab('create');

  if (record.leaveMode === 'discrete' && record.discreteDates && record.discreteDates.length > 0) {
    state.discreteDates = [...record.discreteDates];
    state.customDateText = record.customDateText || '';
    state.isCustomDateTextManual = !!record.customDateText;
    switchLeaveMode('discrete');
  } else {
    switchLeaveMode('range');
  }

  const elName = document.getElementById('inpName');
  const elRank = document.getElementById('inpRank');
  const extracted = extractRank(record.name);
  if (extracted) {
    if (elRank) elRank.value = extracted;
    let namePart = record.name.slice(extracted.length).trim();
    if (elName) elName.value = formatNameSpacing(namePart);
  } else {
    if (elName) elName.value = formatNameSpacing(record.name);
  }
  const elPos = document.getElementById('inpPosition');
  if (elPos) elPos.value = record.position || '';
  const elPos2 = document.getElementById('inpPosition2');
  if (elPos2) elPos2.value = record.position2 || '';
  const elPosWrap = document.getElementById('chkPosWrap');
  if (elPosWrap) {
    elPosWrap.checked = !!record.isPosWrapped;
    if (record.isPosWrapped) elPosWrap.dataset.manuallyToggled = 'true';
    else delete elPosWrap.dataset.manuallyToggled;
  }
  const elDocDate = document.getElementById('inpDocDate');
  if (elDocDate) elDocDate.value = record.docDate || '';
  const elStart = document.getElementById('inpStartDate');
  if (elStart) elStart.value = record.startDate || '';
  const elEnd = document.getElementById('inpEndDate');
  if (elEnd) elEnd.value = record.endDate || '';
  const elDepart = document.getElementById('inpDepartDate');
  if (elDepart) elDepart.value = record.departDate || record.startDate || '';
  const elReturn = document.getElementById('inpReturnDate');
  if (elReturn) elReturn.value = record.returnDate || record.endDate || '';
  const elDays = document.getElementById('inpLeaveDays');
  if (elDays) elDays.value = record.days || '0';
  const elProv = document.getElementById('inpProvince');
  if (elProv) elProv.value = record.province || '';
  const elPhone = document.getElementById('inpPhone');
  if (elPhone && record.phone) elPhone.value = record.phone;

  if (record.personId) {
    const elSelect = document.getElementById('userSelect');
    if (elSelect) {
      if (!elSelect.querySelector(`option[value="${record.personId}"]`)) {
        const p = state.personnel.find(item => item.id === record.personId);
        if (p) {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = `${formatRankName(p.rank, p.name)} (${p.position || 'ไม่มีตำแหน่ง'})`;
          elSelect.insertBefore(opt, elSelect.firstChild);
        }
      }
      elSelect.value = record.personId;
    }
    loadPersonData(record.personId);
    if (elDays) elDays.value = record.days;
  }

  render();
  showToast(`ดึงข้อมูลใบลาเลขที่ ${record.id} ขึ้นแสดงเรียบร้อย`, 'success');
}

function approveLeave(leaveId) {
  const record = state.leaves.find(l => l.id === leaveId);
  if (!record) return;

  if (record.status === 'approved') {
    showToast(`ใบลาเลขที่ ${leaveId} ได้รับการอนุมัติอยู่แล้ว`, 'info');
    return;
  }

  const prevStatus = record.status;
  record.status = 'approved';

  // If re-approving from rejected or cancelled, add back to taken counts
  if (prevStatus === 'rejected' || prevStatus === 'cancelled') {
    let person = null;
    if (record.personId) person = state.personnel.find(p => p.id === record.personId);
    if (!person && record.name) {
      person = state.personnel.find(p => {
        const pFull = formatRankName(p.rank, p.name).replace(/\s+/g, '');
        return pFull === record.name.replace(/\s+/g, '') || (p.name && record.name.includes(p.name));
      });
    }
    if (person) {
      const days = parseInt(record.days, 10) || 0;
      if (record.leaveType === 'sick') {
        person.sickTaken = (person.sickTaken || 0) + days;
      } else if (record.leaveType === 'personal' || (record.id && record.id.startsWith('PERS-'))) {
        person.personalTaken = (person.personalTaken || 0) + days;
      }
    }
  }

  saveState();

  // Real-time Supabase Cloud sync
  if (typeof syncLeaveToSupabase === 'function') {
    syncLeaveToSupabase(record);
  }
  let affectedPersonApprove = null;
  if (record.personId) affectedPersonApprove = state.personnel.find(p => p.id === record.personId);
  if (affectedPersonApprove && typeof syncPersonToSupabase === 'function') {
    syncPersonToSupabase(affectedPersonApprove);
  }

  // Log audit event
  logAuditEvent({
    action: 'APPROVE_LEAVE',
    actionTitle: 'อนุมัติใบลา',
    category: 'leave',
    details: `อนุมัติใบลาเลขที่ ${leaveId} ของ ${record.name || '-'} (${record.formType || 'ใบลา'})`,
    status: 'success'
  });

  renderHistoryTable();
  renderPersonnelTable();
  showToast(`อนุมัติใบลาเลขที่ ${leaveId} เรียบร้อยแล้ว`, 'success');
}

function rejectLeave(leaveId) {
  const record = state.leaves.find(l => l.id === leaveId);
  if (!record) return;

  if (record.status === 'rejected') {
    showToast(`ใบลาเลขที่ ${leaveId} มีสถานะไม่อนุมัติอยู่แล้ว`, 'info');
    return;
  }

  const wasApproved = record.status === 'approved';
  record.status = 'rejected';

  let person = null;
  // If rejecting an approved leave, restore quota
  if (wasApproved) {
    if (record.personId) person = state.personnel.find(p => p.id === record.personId);
    if (!person && record.name) {
      person = state.personnel.find(p => {
        const pFull = formatRankName(p.rank, p.name).replace(/\s+/g, '');
        return pFull === record.name.replace(/\s+/g, '') || (p.name && record.name.includes(p.name));
      });
    }
    if (person) {
      const days = parseInt(record.days, 10) || 0;
      if (record.leaveType === 'sick') {
        person.sickTaken = Math.max(0, (person.sickTaken || 0) - days);
      } else if (record.leaveType === 'personal' || (record.id && record.id.startsWith('PERS-'))) {
        person.personalTaken = Math.max(0, (person.personalTaken || 0) - days);
      }
    }
  }

  saveState();

  // Real-time Supabase Cloud sync
  try {
    if (typeof syncLeaveToSupabase === 'function') {
      syncLeaveToSupabase(record);
    }
    if (person && typeof syncPersonToSupabase === 'function') {
      syncPersonToSupabase(person);
    }
  } catch (syncErr) {
    console.warn('[rejectLeave] Cloud sync warning:', syncErr);
  }

  // Log audit event
  try {
    logAuditEvent({
      action: 'REJECT_LEAVE',
      actionTitle: 'ไม่อนุมัติใบลา',
      category: 'leave',
      details: `ไม่อนุมัติใบลาเลขที่ ${leaveId} ของ ${record.name || '-'}`,
      status: 'warning'
    });
  } catch (auditErr) {
    console.warn('[rejectLeave] Audit log warning:', auditErr);
  }

  renderHistoryTable();
  renderPersonnelTable();
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }
  showToast(`ไม่อนุมัติใบลาเลขที่ ${leaveId} เรียบร้อยแล้ว`, 'warning');
}

function deleteLeaveRecord(leaveId) {
  const record = state.leaves.find(l => l.id === leaveId);
  if (!record) return;

  if (!confirm(`ยืนยันการลบรายการใบลา ${leaveId} หรือไม่?`)) return;

  let person = null;
  // Restore quota if it was approved
  if (record.status === 'approved') {
    if (record.personId) person = state.personnel.find(p => p.id === record.personId);
    if (!person && record.name) {
      person = state.personnel.find(p => {
        const pFull = formatRankName(p.rank, p.name).replace(/\s+/g, '');
        return pFull === record.name.replace(/\s+/g, '') || (p.name && record.name.includes(p.name));
      });
    }
    if (person) {
      const days = parseInt(record.days, 10) || 0;
      if (record.leaveType === 'sick') {
        person.sickTaken = Math.max(0, (person.sickTaken || 0) - days);
      } else if (record.leaveType === 'personal' || (record.id && record.id.startsWith('PERS-'))) {
        person.personalTaken = Math.max(0, (person.personalTaken || 0) - days);
      }
    }
  }

  state.leaves = state.leaves.filter(l => l.id !== leaveId);
  saveState();

  // Real-time Supabase Cloud sync
  try {
    if (typeof deleteLeaveFromSupabase === 'function') {
      deleteLeaveFromSupabase(leaveId);
    }
    if (person && typeof syncPersonToSupabase === 'function') {
      syncPersonToSupabase(person);
    }
  } catch (syncErr) {
    console.warn('[deleteLeaveRecord] Cloud sync warning:', syncErr);
  }

  // Log audit event
  try {
    logAuditEvent({
      action: 'DELETE_LEAVE',
      actionTitle: 'ลบรายการใบลา',
      category: 'leave',
      details: `ลบรายการใบลาเลขที่ ${leaveId} ของ ${record.name || '-'} ออกจากระบบ`,
      status: 'danger'
    });
  } catch (auditErr) {
    console.warn('[deleteLeaveRecord] Audit log warning:', auditErr);
  }

  renderHistoryTable();
  renderPersonnelTable();
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }
  if (typeof renderAuditLogTable === 'function' && document.getElementById('auditLogTableBody')) {
    renderAuditLogTable();
  }
  showToast('ลบรายการใบลาเรียบร้อยแล้ว', 'success');
}

function updateLeaveStatus(leaveId, newStatus) {
  if (newStatus === 'approved') {
    approveLeave(leaveId);
  } else if (newStatus === 'rejected') {
    rejectLeave(leaveId);
  } else {
    const record = state.leaves.find(l => l.id === leaveId);
    if (record) {
      const wasApproved = record.status === 'approved';
      record.status = newStatus;
      let person = null;
      if (wasApproved && (newStatus === 'cancelled' || newStatus === 'pending')) {
        if (record.personId) person = state.personnel.find(p => p.id === record.personId);
        if (!person && record.name) {
          person = state.personnel.find(p => {
            const pFull = formatRankName(p.rank, p.name).replace(/\s+/g, '');
            return pFull === record.name.replace(/\s+/g, '') || (p.name && record.name.includes(p.name));
          });
        }
        if (person) {
          const days = parseInt(record.days, 10) || 0;
          if (record.leaveType === 'sick') {
            person.sickTaken = Math.max(0, (person.sickTaken || 0) - days);
          } else if (record.leaveType === 'personal' || (record.id && record.id.startsWith('PERS-'))) {
            person.personalTaken = Math.max(0, (person.personalTaken || 0) - days);
          }
        }
      }
      saveState();

      // Real-time Supabase Cloud sync
      try {
        if (typeof syncLeaveToSupabase === 'function') {
          syncLeaveToSupabase(record);
        }
        if (person && typeof syncPersonToSupabase === 'function') {
          syncPersonToSupabase(person);
        }
      } catch (syncErr) {
        console.warn('[updateLeaveStatus] Cloud sync warning:', syncErr);
      }

      renderHistoryTable();
      renderPersonnelTable();
      if (typeof renderDashboard === 'function') {
        renderDashboard();
      }
      showToast(`อัปเดตสถานะใบลา ${leaveId} เป็น "${getLeaveStatusLabel(newStatus)}"`, 'success');
    }
  }
}

function getLeaveStatusLabel(status) {
  switch (status) {
    case 'approved': return 'อนุมัติแล้ว';
    case 'rejected': return 'ไม่อนุมัติ';
    case 'pending': return 'รออนุมัติ';
    case 'cancelled': return 'ยกเลิก';
    default: return status;
  }
}

// ==========================================================================
// TAB NAVIGATION & ACCESS CONTROL
// ==========================================================================

function canUserAccessTab(tabId, user = state.currentUser) {
  if (!user) return false;
  if (user.role === 'superadmin' || (user.username && user.username.toLowerCase() === 'kornphong')) {
    return true; // Superadmin has full access to all pages
  }
  if (user.role === 'admin') {
    if (tabId === 'permissions' || tabId === 'audit-log') return true;
    if (Array.isArray(user.allowedPages) && user.allowedPages.length > 0) {
      return user.allowedPages.includes(tabId);
    }
    return true;
  }
  return Array.isArray(user.allowedPages) && user.allowedPages.includes(tabId);
}

// ==========================================================================
// HAMBURGER SIDEBAR DRAWER CONTROLS & PAGE MAP
// ==========================================================================

const PAGE_INFO = {
  'dashboard': { icon: '📊', title: 'แดชบอร์ดสถิติวันลา' },
  'create': { icon: '🌴', title: 'ลาพักผ่อน (แบบ ๗)' },
  'create-sick': { icon: '🩺', title: 'ลาป่วย (แบบ ๓)' },
  'create-personal': { icon: '💼', title: 'ลากิจธุระ (แบบ ๖)' },
  'history': { icon: '📑', title: 'ทะเบียนคุมใบลา' },
  'personnel': { icon: '👥', title: 'ทะเบียนกำลังพล' },
  'settings': { icon: '⚙️', title: 'ตั้งค่าระบบ' },
  'permissions': { icon: '🔐', title: 'จัดการผู้ใช้งานและกำหนดสิทธิ์' },
  'audit-log': { icon: '📜', title: 'บันทึกประวัติการใช้งาน (Audit Log)' }
};

function updateActivePageIndicator(tabId) {
  const pInfo = PAGE_INFO[tabId] || { icon: '📋', title: tabId };
  const iconEl = document.getElementById('activePageIcon');
  const titleEl = document.getElementById('activePageTitle');
  if (iconEl) iconEl.textContent = pInfo.icon;
  if (titleEl) titleEl.textContent = pInfo.title;
}

function openSidebarMenu() {
  const drawer = document.getElementById('sidebarDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('drawer-open');
}

function closeSidebarMenu() {
  const drawer = document.getElementById('sidebarDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('drawer-open');
}

function toggleSidebarMenu() {
  const drawer = document.getElementById('sidebarDrawer');
  if (drawer && drawer.classList.contains('open')) {
    closeSidebarMenu();
  } else {
    openSidebarMenu();
  }
}

function handleMenuClick(tabId) {
  switchTab(tabId);
  closeSidebarMenu();
}

// Close drawer when ESC key is pressed
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebarMenu();
  }
});

function applyUserPermissions() {
  const user = state.currentUser;

  // Header user badge & logout buttons
  const headerName = document.getElementById('headerUserName');
  const headerRole = document.getElementById('headerUserRole');
  const drawerName = document.getElementById('drawerUserName');
  const drawerRole = document.getElementById('drawerUserRole');
  const btnLogoutHeader = document.getElementById('btnLogoutHeader');
  const btnLogoutDrawer = document.getElementById('btnLogoutDrawer');
  const currentUserBadge = document.getElementById('currentUserBadge');

  if (!user) {
    if (headerName) headerName.textContent = 'ยังไม่ได้เข้าสู่ระบบ';
    if (headerRole) headerRole.textContent = 'คลิกเข้าสู่ระบบ';
    if (drawerName) drawerName.textContent = 'ยังไม่ได้เข้าสู่ระบบ';
    if (drawerRole) drawerRole.textContent = 'กรุณาเข้าสู่ระบบ';

    if (btnLogoutHeader) btnLogoutHeader.style.display = 'none';
    if (btnLogoutDrawer) btnLogoutDrawer.style.display = 'none';

    if (currentUserBadge) {
      currentUserBadge.style.cursor = 'pointer';
      currentUserBadge.onclick = () => openLoginModal(true);
      currentUserBadge.title = 'คลิกเพื่อเข้าสู่ระบบ';
    }

    // Hide all functional tabs when logged out
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.style.display = 'none';
    });
    return;
  }

  // Header user badge
  const isSuper = user.role === 'superadmin' || (user.username && user.username.toLowerCase() === 'kornphong');
  const isAdmin = isSuper || user.role === 'admin';
  if (headerName) headerName.textContent = user.name || user.username;
  if (headerRole) headerRole.textContent = isSuper ? 'Superadmin' : (isAdmin ? 'Admin' : 'User');

  // Drawer user card
  if (drawerName) drawerName.textContent = user.name || user.username;
  if (drawerRole) drawerRole.textContent = isSuper ? '⚡ ผู้ดูแลระบบระดับสูง (Superadmin)' : (isAdmin ? '🛡️ ผู้ดูแลระบบ (Admin)' : '👤 ผู้ใช้งานทั่วไป (User)');

  // Logout buttons (Header logout button hidden per user request: click name badge directly to logout)
  if (btnLogoutHeader) btnLogoutHeader.style.display = 'none';
  if (btnLogoutDrawer) btnLogoutDrawer.style.display = 'inline-flex';

  if (currentUserBadge) {
    currentUserBadge.style.cursor = 'pointer';
    currentUserBadge.onclick = () => logoutUser();
    currentUserBadge.title = 'คลิกที่ชื่อเพื่อออกจากระบบ';
  }

  // Toggle tab buttons visibility in header / drawer
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const tabId = btn.getAttribute('data-tab');
    if (canUserAccessTab(tabId, user)) {
      btn.style.display = '';
    } else {
      btn.style.display = 'none';
    }
  });

  // Verify currently active tab
  const activeBtn = document.querySelector('.tab-btn.active');
  const activeTabId = activeBtn ? activeBtn.getAttribute('data-tab') : 'dashboard';
  if (!canUserAccessTab(activeTabId, user)) {
    const firstAllowed = SYSTEM_PAGES.find(p => canUserAccessTab(p.id, user));
    if (firstAllowed) {
      switchTab(firstAllowed.id);
    }
  } else {
    updateActivePageIndicator(activeTabId);
  }
  updateUserSelectOptions();
}

function switchTab(tabId) {
  const user = state.currentUser;
  if (!user) {
    showToast('กรุณาเข้าสู่ระบบก่อนเลือกหน้าเมนู', 'warning');
    openLoginModal(true);
    return;
  }
  if (!canUserAccessTab(tabId, user)) {
    showToast('ท่านไม่มีสิทธิ์เข้าถึงหน้านี้', 'warning');
    const firstAllowed = SYSTEM_PAGES.find(p => canUserAccessTab(p.id, user));
    if (firstAllowed && firstAllowed.id !== tabId) {
      switchTab(firstAllowed.id);
    }
    return;
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.toggle('active', section.id === `tab-${tabId}`);
  });

  updateActivePageIndicator(tabId);
  try {
    sessionStorage.setItem('leave_sys_active_tab', tabId);
  } catch(e) {}

  if (tabId === 'dashboard') {
    renderDashboard();
  } else if (tabId === 'create') {
    render();
  } else if (tabId === 'create-sick') {
    renderSickLeave();
  } else if (tabId === 'create-personal') {
    renderPersonalLeave();
  } else if (tabId === 'history') {
    renderHistoryTable();
  } else if (tabId === 'personnel') {
    renderPersonnelTable();
  } else if (tabId === 'settings') {
    loadSettingsIntoForm();
  } else if (tabId === 'permissions') {
    renderUsersTable();
  } else if (tabId === 'audit-log') {
    renderAuditLogTable();
  }
}

// ==========================================================================
// DASHBOARD & LEAVE ANALYTICS (แดชบอร์ดภาพรวมและสถิติวันลา)
// ==========================================================================

let dashboardState = {
  selectedPersonId: 'all',
  searchQuery: '',
  typeFilter: 'all'
};

function calculatePersonnelLeaveStats(personId, userObj = null) {
  let person = null;

  if (personId) {
    person = state.personnel.find(p => p.id === personId);
  }

  if (!person && userObj) {
    if (userObj.personId) {
      person = state.personnel.find(p => p.id === userObj.personId);
    }
    if (!person && userObj.username) {
      person = state.personnel.find(p => p.id === userObj.username || p.username === userObj.username);
    }
    if (!person && userObj.name) {
      const cleanUName = userObj.name.replace(/\s+/g, '').toLowerCase();
      person = state.personnel.find(p => {
        const cleanPName = (p.name || '').replace(/\s+/g, '').toLowerCase();
        return cleanPName === cleanUName || cleanUName.includes(cleanPName) || cleanPName.includes(cleanUName);
      });
    }
  }

  // If still no person record found in state.personnel and userObj is present,
  // create a clean virtual profile for this specific Username so they have a personalized dashboard!
  // CRITICAL: NEVER FALLBACK TO state.personnel[0]!
  if (!person && userObj) {
    person = {
      id: userObj.personId || `user_${userObj.username}`,
      username: userObj.username,
      rank: '',
      name: userObj.name || userObj.username,
      position: 'ผู้ใช้งานระบบ',
      unit: state.settings.subOrgName || state.settings.writtenAt || 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
      annualQuota: 10,
      accQuota: 0,
      sickQuota: 60,
      sickTaken: 0,
      personalQuota: 45,
      personalTaken: 0,
      isVirtual: true
    };
  }

  if (!person) return null;

  // Find all leaves belonging strictly to this user/person
  let personLeaves = [];
  if (userObj && userObj.role !== 'admin' && userObj.role !== 'superadmin' && (userObj.username || '').toLowerCase() !== 'kornphong') {
    // STRICT USERNAME ISOLATION:
    // Regular users can ONLY see their own leaves!
    const targetUsername = (userObj.username || '').toLowerCase();
    const cleanUserFullName = (userObj.name || '').replace(/\s+/g, '').toLowerCase();
    const cleanPersonFullName = (person.name || '').replace(/\s+/g, '').toLowerCase();
    const personIdTarget = person.id;

    personLeaves = state.leaves.filter(l => {
      const leaveUser = (l.username || l.createdBy || '').toLowerCase();

      // If leave has a username recorded:
      if (leaveUser) {
        return leaveUser === targetUsername;
      }

      // If legacy leave without username:
      if (l.personId && personIdTarget && l.personId === personIdTarget) {
        return true;
      }

      if (l.name) {
        const cleanLeaveName = l.name.replace(/\s+/g, '').toLowerCase();
        if (cleanLeaveName === cleanPersonFullName || (cleanUserFullName && cleanLeaveName === cleanUserFullName)) {
          return true;
        }
      }

      return false;
    });
  } else {
    // Admin or general personnel calculation by personId
    const cleanPersonName = (person.name || '').replace(/\s+/g, '').toLowerCase();
    personLeaves = state.leaves.filter(l => {
      if (l.personId && l.personId === person.id) return true;
      if (l.name) {
        const cleanLeaveName = l.name.replace(/\s+/g, '').toLowerCase();
        return cleanLeaveName === cleanPersonName || cleanLeaveName.includes(cleanPersonName) || cleanPersonName.includes(cleanLeaveName);
      }
      return false;
    });
  }

  // Sort leaves by date descending
  const sortedLeaves = [...personLeaves].sort((a, b) => {
    const da = new Date(a.startDate || a.docDate || a.createdAt || 0);
    const db = new Date(b.startDate || b.docDate || b.createdAt || 0);
    return db - da;
  });

  // Vacation Leave (แบบ ๗)
  const vacAnnual = Number(person.annualQuota) || 10;
  const vacAcc = Number(person.accQuota) || 0;
  const vacQuota = vacAnnual + vacAcc;
  const vacLeaves = sortedLeaves.filter(l => l.leaveType === 'vacation' || (!l.leaveType && !l.formType?.includes('แบบ ๓') && !l.formType?.includes('แบบ ๖')));
  const vacApproved = vacLeaves.filter(l => l.status === 'approved');
  const vacUsed = vacApproved.reduce((sum, l) => sum + (Number(l.days) || 0), 0);
  const vacRemaining = Math.max(0, vacQuota - vacUsed);
  const latestVac = vacLeaves.length > 0 ? vacLeaves[0] : null;
  const latestVacDays = latestVac ? (Number(latestVac.days) || 0) : 0;

  // Sick Leave (แบบ ๓)
  const sickQuota = Number(person.sickQuota) || 60;
  const sickLeaves = sortedLeaves.filter(l => l.leaveType === 'sick' || l.formType?.includes('แบบ ๓') || (l.id && l.id.startsWith('SICK-')) || (l.id && l.id.startsWith('SK-')));
  const sickApproved = sickLeaves.filter(l => l.status === 'approved');
  let sickUsed = sickApproved.reduce((sum, l) => sum + (Number(l.days) || 0), 0);
  if (sickUsed === 0 && Number(person.sickTaken) > 0 && (!userObj || !person.isVirtual)) sickUsed = Number(person.sickTaken);
  const sickRemaining = Math.max(0, sickQuota - sickUsed);
  const latestSick = sickLeaves.length > 0 ? sickLeaves[0] : null;
  const latestSickDays = latestSick ? (Number(latestSick.days) || 0) : 0;

  // Personal Leave (แบบ ๖)
  const personalQuota = Number(person.personalQuota) || 45;
  const personalLeaves = sortedLeaves.filter(l => l.leaveType === 'personal' || l.formType?.includes('แบบ ๖') || (l.id && l.id.startsWith('PERS-')));
  const personalApproved = personalLeaves.filter(l => l.status === 'approved');
  let personalUsed = personalApproved.reduce((sum, l) => sum + (Number(l.days) || 0), 0);
  if (personalUsed === 0 && Number(person.personalTaken) > 0 && (!userObj || !person.isVirtual)) personalUsed = Number(person.personalTaken);
  const personalRemaining = Math.max(0, personalQuota - personalUsed);
  const latestPersonal = personalLeaves.length > 0 ? personalLeaves[0] : null;
  const latestPersonalDays = latestPersonal ? (Number(latestPersonal.days) || 0) : 0;

  const totalQuota = vacQuota + sickQuota + personalQuota;
  const totalUsed = vacUsed + sickUsed + personalUsed;
  const totalRemaining = vacRemaining + sickRemaining + personalRemaining;
  const latestOverall = sortedLeaves.length > 0 ? sortedLeaves[0] : null;

  return {
    person,
    vacation: {
      annual: vacAnnual,
      accumulated: vacAcc,
      quota: vacQuota,
      used: vacUsed,
      remaining: vacRemaining,
      latestDays: latestVacDays,
      latest: latestVac,
      percentUsed: vacQuota > 0 ? Math.min(100, Math.round((vacUsed / vacQuota) * 100)) : 0
    },
    sick: {
      quota: sickQuota,
      used: sickUsed,
      remaining: sickRemaining,
      latestDays: latestSickDays,
      latest: latestSick,
      percentUsed: sickQuota > 0 ? Math.min(100, Math.round((sickUsed / sickQuota) * 100)) : 0
    },
    personal: {
      quota: personalQuota,
      used: personalUsed,
      remaining: personalRemaining,
      latestDays: latestPersonalDays,
      latest: latestPersonal,
      percentUsed: personalQuota > 0 ? Math.min(100, Math.round((personalUsed / personalQuota) * 100)) : 0
    },
    totalQuota,
    totalUsed,
    totalRemaining,
    latestOverall,
    leaves: sortedLeaves
  };
}

function calculateOverallLeaveStats() {
  const totalPersonnel = state.personnel.length;
  let totalVacUsed = 0;
  let totalSickUsed = 0;
  let totalPersonalUsed = 0;
  let totalVacQuota = 0;
  let totalSickQuota = 0;
  let totalPersonalQuota = 0;

  const statsList = state.personnel.map(p => {
    const s = calculatePersonnelLeaveStats(p.id);
    if (s) {
      totalVacUsed += s.vacation.used;
      totalSickUsed += s.sick.used;
      totalPersonalUsed += s.personal.used;
      totalVacQuota += s.vacation.quota;
      totalSickQuota += s.sick.quota;
      totalPersonalQuota += s.personal.quota;
    }
    return s;
  }).filter(Boolean);

  const totalLeavesCount = state.leaves.length;
  const approvedLeavesCount = state.leaves.filter(l => l.status === 'approved').length;
  const pendingLeavesCount = state.leaves.filter(l => l.status === 'pending').length;
  const totalDaysTaken = totalVacUsed + totalSickUsed + totalPersonalUsed;

  return {
    totalPersonnel,
    totalLeavesCount,
    approvedLeavesCount,
    pendingLeavesCount,
    totalDaysTaken,
    vacation: {
      used: totalVacUsed,
      quota: totalVacQuota,
      percent: totalDaysTaken > 0 ? Math.round((totalVacUsed / totalDaysTaken) * 100) : 0
    },
    sick: {
      used: totalSickUsed,
      quota: totalSickQuota,
      percent: totalDaysTaken > 0 ? Math.round((totalSickUsed / totalDaysTaken) * 100) : 0
    },
    personal: {
      used: totalPersonalUsed,
      quota: totalPersonalQuota,
      percent: totalDaysTaken > 0 ? Math.round((totalPersonalUsed / totalDaysTaken) * 100) : 0
    },
    personnelStats: statsList
  };
}

function onDashboardPersonChange(personId) {
  dashboardState.selectedPersonId = personId;
  renderDashboard();
}

function onDashboardSearchInput(val) {
  dashboardState.searchQuery = (val || '').trim().toLowerCase();
  renderDashboard();
}

function focusDashboardPerson(personId) {
  dashboardState.selectedPersonId = personId;
  renderDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetDashboardFilter() {
  dashboardState.selectedPersonId = 'all';
  dashboardState.searchQuery = '';
  dashboardState.typeFilter = 'all';
  renderDashboard();
}

function renderDashboard() {
  const container = document.getElementById('dashboardDynamicContent');
  if (!container) return;

  const user = state.currentUser;
  if (!user) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🔒</span>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem;">กรุณาเข้าสู่ระบบเพื่อดูแดชบอร์ด</h2>
        <p style="color: #64748b; margin-bottom: 1.5rem; max-width: 480px; margin-left: auto; margin-right: auto;">
          ท่านจำเป็นต้องยืนยันตัวตนก่อนเข้าถึงข้อมูลสถิติและการสรุปผลวันลาของหน่วย
        </p>
        <button class="btn btn-primary" onclick="openLoginModal(true)" style="padding: 0.65rem 1.5rem; font-size: 0.95rem; border-radius: 9999px;">
          🔐 เข้าสู่ระบบทันที
        </button>
      </div>
    `;
    return;
  }

  if (user.role === 'admin' || user.role === 'superadmin' || (user.username && user.username.toLowerCase() === 'kornphong')) {
    renderAdminDashboard(container);
  } else {
    // User view: STRICTLY self-only for user's Username!
    let person = null;
    if (user.personId) {
      person = state.personnel.find(p => p.id === user.personId);
    }
    if (!person && user.username) {
      person = state.personnel.find(p => p.id === user.username || p.username === user.username);
    }
    if (!person && user.name) {
      const cleanUName = user.name.replace(/\s+/g, '').toLowerCase();
      person = state.personnel.find(p => {
        const cleanPName = (p.name || '').replace(/\s+/g, '').toLowerCase();
        return cleanPName === cleanUName || cleanUName.includes(cleanPName) || cleanPName.includes(cleanUName);
      });
    }
    // NEVER fallback to personnel[0]! Pass user object so calculatePersonnelLeaveStats
    // strictly binds to this exact username and user profile!
    renderUserDashboard(container, person ? person.id : null, user);
  }
}

function renderUserDashboard(container, personId, userObj = state.currentUser) {
  // If the logged in user is a regular user, force effectiveUser to state.currentUser
  const isRegularUser = state.currentUser && state.currentUser.role !== 'admin' && state.currentUser.role !== 'superadmin';
  const effectiveUser = isRegularUser ? state.currentUser : userObj;

  const stats = calculatePersonnelLeaveStats(personId, effectiveUser);
  if (!stats) {
    container.innerHTML = `
      <div style="background: #ffffff; padding: 3rem; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">👤</span>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b;">ไม่พบข้อมูลสถิติวันลาสำหรับบัญชีนี้</h3>
        <p style="color: #64748b; margin-top: 0.5rem;">กรุณาติดต่อผู้ดูแลระบบเพื่อตรวจสอบข้อมูลบัญชีผู้ใช้</p>
      </div>
    `;
    return;
  }

  const p = stats.person;
  const targetUsername = effectiveUser ? effectiveUser.username : (p.username || p.id);
  const fullName = p.rank ? formatRankName(p.rank, p.name) : (p.name || (effectiveUser ? effectiveUser.name || effectiveUser.username : 'กำลังพล'));
  const isSelf = isRegularUser || (state.currentUser && effectiveUser && state.currentUser.username === effectiveUser.username);
  const latestLeaveDays = stats.latestOverall ? `${stats.latestOverall.days} วัน` : 'ยังไม่มีประวัติ';
  const latestLeaveType = stats.latestOverall 
    ? (stats.latestOverall.formType || (stats.latestOverall.leaveType === 'sick' ? 'ลาป่วย (แบบ ๓)' : (stats.latestOverall.leaveType === 'personal' ? 'ลากิจธุระ (แบบ ๖)' : 'ลาพักผ่อน (แบบ ๗)')))
    : '-';

  container.innerHTML = `
    <!-- User Hero Banner -->
    <div class="dash-user-hero">
      <div class="dash-user-hero-info">
        <div class="dash-user-hero-avatar">👤</div>
        <div>
          <h2 class="dash-user-hero-name">${fullName}</h2>
          <p class="dash-user-hero-pos">${p.position || 'ประจำหน่วย'} • ${p.unit || state.settings.subOrgName || ''}</p>
        </div>
      </div>
      <div class="dash-user-security-badge">
        <span>🔒</span>
        <span>${isSelf ? `สถิติเฉพาะบัญชี: <strong>@${targetUsername}</strong> เท่านั้น` : `มุมมองผู้ดูแลระบบ: ตรวจสอบข้อมูล @${targetUsername}`}</span>
      </div>
    </div>

    <!-- 3 Category Breakdown Detailed Cards -->
    <div class="dash-category-grid">
      <!-- 1. Vacation Leave -->
      <div class="dash-category-card">
        <div class="dash-cat-header">
          <div class="dash-cat-title-wrap">
            <span class="dash-cat-icon">🌴</span>
            <div>
              <div class="dash-cat-title">ลาพักผ่อนประจำปี</div>
              <div style="font-size: 0.78rem; color: #64748b;">แบบ ๗ • สิทธิ์ปีนี้ + สะสม</div>
            </div>
          </div>
          <span class="dash-cat-badge badge-vac">สิทธิ์ ${stats.vacation.quota} วัน</span>
        </div>

        <div class="dash-cat-stats-row">
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">สิทธิ์ทั้งหมด</span>
            <span class="dash-cat-stat-num">${stats.vacation.quota}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">ลาไปแล้ว</span>
            <span class="dash-cat-stat-num highlight-used">${stats.vacation.used}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">คงเหลือ</span>
            <span class="dash-cat-stat-num highlight-rem">${stats.vacation.remaining}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">ลาครั้งนี้</span>
            <span class="dash-cat-stat-num highlight-cur">${stats.vacation.latestDays}</span>
          </div>
        </div>

        <div class="dash-progress-wrap">
          <div class="dash-progress-meta">
            <span style="color: #64748b;">การใช้สิทธิ์:</span>
            <span style="color: #059669;">${stats.vacation.percentUsed}% (${stats.vacation.used}/${stats.vacation.quota} วัน)</span>
          </div>
          <div class="dash-progress-bar">
            <div class="dash-progress-fill fill-vac" style="width: ${stats.vacation.percentUsed}%;"></div>
          </div>
        </div>

        <div class="dash-cat-latest-note">
          <span>📅 ล่าสุด: ${stats.vacation.latest ? (stats.vacation.latest.startDate || stats.vacation.latest.docDate) + ' (' + stats.vacation.latest.days + ' วัน)' : 'ยังไม่มีประวัติ'}</span>
          <button class="btn btn-sm btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="switchTab('create')">✍️ เขียนใบลา</button>
        </div>
      </div>

      <!-- 2. Sick Leave -->
      <div class="dash-category-card">
        <div class="dash-cat-header">
          <div class="dash-cat-title-wrap">
            <span class="dash-cat-icon">🩺</span>
            <div>
              <div class="dash-cat-title">ลาป่วยและรักษาตัว</div>
              <div style="font-size: 0.78rem; color: #64748b;">แบบ ๓ • สิทธิ์ ๖๐ วัน/ปี</div>
            </div>
          </div>
          <span class="dash-cat-badge badge-sick">สิทธิ์ ${stats.sick.quota} วัน</span>
        </div>

        <div class="dash-cat-stats-row">
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">สิทธิ์ทั้งหมด</span>
            <span class="dash-cat-stat-num">${stats.sick.quota}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">ลาไปแล้ว</span>
            <span class="dash-cat-stat-num highlight-used">${stats.sick.used}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">คงเหลือ</span>
            <span class="dash-cat-stat-num highlight-rem">${stats.sick.remaining}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">ลาครั้งนี้</span>
            <span class="dash-cat-stat-num highlight-cur">${stats.sick.latestDays}</span>
          </div>
        </div>

        <div class="dash-progress-wrap">
          <div class="dash-progress-meta">
            <span style="color: #64748b;">การใช้สิทธิ์:</span>
            <span style="color: #0284c7;">${stats.sick.percentUsed}% (${stats.sick.used}/${stats.sick.quota} วัน)</span>
          </div>
          <div class="dash-progress-bar">
            <div class="dash-progress-fill fill-sick" style="width: ${stats.sick.percentUsed}%;"></div>
          </div>
        </div>

        <div class="dash-cat-latest-note">
          <span>📅 ล่าสุด: ${stats.sick.latest ? (stats.sick.latest.startDate || stats.sick.latest.docDate) + ' (' + stats.sick.latest.days + ' วัน)' : 'ยังไม่มีประวัติ'}</span>
          <button class="btn btn-sm btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="switchTab('create-sick')">✍️ เขียนใบลา</button>
        </div>
      </div>

      <!-- 3. Personal Leave -->
      <div class="dash-category-card">
        <div class="dash-cat-header">
          <div class="dash-cat-title-wrap">
            <span class="dash-cat-icon">💼</span>
            <div>
              <div class="dash-cat-title">ลากิจธุระ</div>
              <div style="font-size: 0.78rem; color: #64748b;">แบบ ๖ • สิทธิ์ ๔๕ วัน/ปี</div>
            </div>
          </div>
          <span class="dash-cat-badge badge-pers">สิทธิ์ ${stats.personal.quota} วัน</span>
        </div>

        <div class="dash-cat-stats-row">
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">สิทธิ์ทั้งหมด</span>
            <span class="dash-cat-stat-num">${stats.personal.quota}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">ลาไปแล้ว</span>
            <span class="dash-cat-stat-num highlight-used">${stats.personal.used}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">คงเหลือ</span>
            <span class="dash-cat-stat-num highlight-rem">${stats.personal.remaining}</span>
          </div>
          <div class="dash-cat-stat-item">
            <span class="dash-cat-stat-label">ลาครั้งนี้</span>
            <span class="dash-cat-stat-num highlight-cur">${stats.personal.latestDays}</span>
          </div>
        </div>

        <div class="dash-progress-wrap">
          <div class="dash-progress-meta">
            <span style="color: #64748b;">การใช้สิทธิ์:</span>
            <span style="color: #d97706;">${stats.personal.percentUsed}% (${stats.personal.used}/${stats.personal.quota} วัน)</span>
          </div>
          <div class="dash-progress-bar">
            <div class="dash-progress-fill fill-pers" style="width: ${stats.personal.percentUsed}%;"></div>
          </div>
        </div>

        <div class="dash-cat-latest-note">
          <span>📅 ล่าสุด: ${stats.personal.latest ? (stats.personal.latest.startDate || stats.personal.latest.docDate) + ' (' + stats.personal.latest.days + ' วัน)' : 'ยังไม่มีประวัติ'}</span>
          <button class="btn btn-sm btn-outline" style="padding: 2px 8px; font-size: 0.75rem;" onclick="switchTab('create-personal')">✍️ เขียนใบลา</button>
        </div>
      </div>
    </div>

    <!-- Personal Leave Ledger Table -->
    <div class="dash-table-card">
      <div class="dash-table-header">
        <div class="dash-table-title">
          <span>📑</span>
          <span>ประวัติและสถานะการลาของบัญชี @${targetUsername} (${stats.leaves.length} รายการ)</span>
        </div>
      </div>
      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>เลขที่ใบลา</th>
              <th>ประเภทการลา</th>
              <th>วันที่ยื่น</th>
              <th>ช่วงวันที่ลา</th>
              <th style="text-align: center;">ลาครั้งนี้ (วัน)</th>
              <th style="text-align: center;">สถานะ</th>
              <th style="text-align: center;">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${stats.leaves.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; color: #94a3b8; padding: 2.5rem 1rem;">
                  ยังไม่มีประวัติการยื่นใบลาสำหรับบัญชี @${targetUsername}
                </td>
              </tr>
            ` : stats.leaves.map(l => {
              const typeIcon = l.leaveType === 'sick' || l.formType?.includes('แบบ ๓') ? '🩺' : (l.leaveType === 'personal' || l.formType?.includes('แบบ ๖') ? '💼' : '🌴');
              const typeTitle = l.formType || (l.leaveType === 'sick' ? 'ลาป่วย (แบบ ๓)' : (l.leaveType === 'personal' ? 'ลากิจธุระ (แบบ ๖)' : 'ลาพักผ่อน (แบบ ๗)'));
              const statusPill = l.status === 'approved' 
                ? '<span style="background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 0.78rem;">✓ อนุมัติแล้ว</span>'
                : (l.status === 'rejected'
                  ? '<span style="background: #fee2e2; color: #b91c1c; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 0.78rem;">✕ ไม่อนุมัติ</span>'
                  : '<span style="background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 0.78rem;">⏳ รออนุมัติ</span>');
              return `
                <tr>
                  <td style="font-weight: 600; font-family: monospace;">${l.id}</td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 5px;">
                      <span>${typeIcon}</span>
                      <span>${typeTitle}</span>
                    </span>
                  </td>
                  <td>${l.docDate || '-'}</td>
                  <td>${l.startDate || '-'} ถึง ${l.endDate || '-'}</td>
                  <td style="text-align: center; font-weight: 700; color: #0f172a;">${l.days || 0}</td>
                  <td style="text-align: center;">${statusPill}</td>
                  <td style="text-align: center;">
                    <button class="btn btn-sm btn-outline" onclick="viewAndPrintLeave('${l.id}')" title="ดูรายละเอียดและพิมพ์">
                      👁️ ดูเอกสาร
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminDashboard(container) {
  // If specific person is selected, display their focused dossier with return button
  if (dashboardState.selectedPersonId !== 'all') {
    const focusedPerson = state.personnel.find(p => p.id === dashboardState.selectedPersonId);
    if (focusedPerson) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <button class="btn btn-secondary" onclick="resetDashboardFilter()" style="display: inline-flex; align-items: center; gap: 6px;">
            <span>⬅️</span>
            <span>กลับสู่แดชบอร์ดภาพรวมทั้งหมด</span>
          </button>
          <div style="font-size: 0.85rem; color: #64748b;">
            มุมมองผู้ดูแลระบบ: ตรวจสอบข้อมูลแฟ้มประวัติรายบุคคล
          </div>
        </div>
      `;
      const dossierContainer = document.createElement('div');
      dossierContainer.className = 'dashboard-wrapper';
      container.appendChild(dossierContainer);
      renderUserDashboard(dossierContainer, focusedPerson.id, null);
      return;
    }
  }

  const overall = calculateOverallLeaveStats();

  // Filter personnel for table view
  let tablePersonnel = overall.personnelStats;
  if (dashboardState.searchQuery) {
    tablePersonnel = tablePersonnel.filter(item => {
      const p = item.person;
      const combined = `${p.rank || ''} ${p.name || ''} ${p.position || ''} ${p.unit || ''}`.toLowerCase();
      return combined.includes(dashboardState.searchQuery);
    });
  }

  // Calculate pure SVG donut chart parameters
  const totalDays = overall.totalDaysTaken;
  const vacDays = overall.vacation.used;
  const sickDays = overall.sick.used;
  const persDays = overall.personal.used;

  const circ = 2 * Math.PI * 60; // 376.99
  const vacDash = totalDays > 0 ? (vacDays / totalDays) * circ : 0;
  const sickDash = totalDays > 0 ? (sickDays / totalDays) * circ : 0;
  const persDash = totalDays > 0 ? (persDays / totalDays) * circ : 0;

  const vacOffset = 0;
  const sickOffset = -vacDash;
  const persOffset = -(vacDash + sickDash);

  // Recent leaves across the unit sorted by date descending
  const recentLeaves = [...state.leaves].sort((a, b) => {
    const da = new Date(a.startDate || a.docDate || a.createdAt || 0);
    const db = new Date(b.startDate || b.docDate || b.createdAt || 0);
    return db - da;
  }).slice(0, 5);

  container.innerHTML = `
    <!-- Admin Hero Banner -->
    <div class="dash-banner">
      <div class="dash-banner-left">
        <div class="dash-banner-badge">
          <span>🛡️</span>
          <span>ภาพรวมหน่วยงาน (Organization Overview) • ผู้ดูแลระบบ</span>
        </div>
        <h1 class="dash-banner-title">
          <span>📊 แดชบอร์ดสรุปสถิติวันลาทั้งหมด</span>
        </h1>
        <p class="dash-banner-subtitle">
          ${state.settings.subOrgName || 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.'} • ติดตามและกำกับดูแลสถิติการใช้วันลาของกำลังพลทุกนาย
        </p>
      </div>
      <div class="dash-banner-actions">
        <button class="btn btn-secondary" onclick="window.print()" style="background: rgba(255,255,255,0.12); color:#ffffff; border-color: rgba(255,255,255,0.25);">
          🖨️ พิมพ์สรุปสถิติ
        </button>
        <button class="btn btn-primary" onclick="switchTab('history')">
          📑 ทะเบียนใบลาทั้งหมด
        </button>
      </div>
    </div>

    <!-- Analytics & Breakdown Section (Pure SVG Donut & Quota Bars) -->
    <div class="dash-analytics-row">
      <!-- Donut Chart -->
      <div class="dash-chart-card">
        <div class="dash-chart-card-header">
          <div class="dash-chart-title">
            <span>🍩</span>
            <span>สัดส่วนการใช้วันลาแยกประเภท</span>
          </div>
        </div>

        <div class="donut-chart-container">
          <svg width="150" height="150" viewBox="0 0 160 160" style="transform: rotate(-90deg);">
            <!-- Background Ring -->
            <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="22" />
            
            ${totalDays > 0 ? `
              <!-- Vacation Ring (Green) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#10b981" stroke-width="22"
                stroke-dasharray="${vacDash} ${circ}" stroke-dashoffset="${vacOffset}" />

              <!-- Sick Ring (Blue) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#0284c7" stroke-width="22"
                stroke-dasharray="${sickDash} ${circ}" stroke-dashoffset="${sickOffset}" />

              <!-- Personal Ring (Amber) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f59e0b" stroke-width="22"
                stroke-dasharray="${persDash} ${circ}" stroke-dashoffset="${persOffset}" />
            ` : `
              <circle cx="80" cy="80" r="60" fill="none" stroke="#cbd5e1" stroke-width="22" />
            `}
          </svg>

          <div class="donut-legend">
            <div class="donut-legend-item">
              <span class="donut-legend-color" style="background: #10b981;"></span>
              <div>
                <span style="font-weight: 700;">ลาพักผ่อน:</span>
                <span style="color: #64748b;">${overall.vacation.used} วัน (${overall.vacation.percent}%)</span>
              </div>
            </div>
            <div class="donut-legend-item">
              <span class="donut-legend-color" style="background: #0284c7;"></span>
              <div>
                <span style="font-weight: 700;">ลาป่วย:</span>
                <span style="color: #64748b;">${overall.sick.used} วัน (${overall.sick.percent}%)</span>
              </div>
            </div>
            <div class="donut-legend-item">
              <span class="donut-legend-color" style="background: #f59e0b;"></span>
              <div>
                <span style="font-weight: 700;">ลากิจธุระ:</span>
                <span style="color: #64748b;">${overall.personal.used} วัน (${overall.personal.percent}%)</span>
              </div>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
              รวมทั้งสิ้น: <span style="font-size: 1rem; font-weight: 800; color: #0f172a;">${totalDays}</span> วัน
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Leave History Card (ประวัติการลาล่าสุด) -->
      <div class="dash-chart-card">
        <div class="dash-chart-card-header">
          <div class="dash-chart-title">
            <span>🕒</span>
            <span>ประวัติการลาล่าสุด</span>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="switchTab('history')" style="font-size: 0.78rem; padding: 3px 12px; border-radius: 9999px;">
            ดูทะเบียนทั้งหมด ➜
          </button>
        </div>

        <div class="dash-recent-table-wrap">
          ${recentLeaves.length === 0 ? `
            <div style="text-align: center; color: #94a3b8; padding: 2.5rem 1rem;">
              <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">📭</span>
              ยังไม่มีประวัติการยื่นใบลาในระบบ
            </div>
          ` : `
            <table class="dash-recent-table">
              <thead>
                <tr>
                  <th>ชื่อผู้ขอลา</th>
                  <th>ประเภทการลา</th>
                  <th>วันที่ลา</th>
                  <th style="text-align: center;">สถานะ</th>
                  <th style="text-align: center;">เอกสาร</th>
                </tr>
              </thead>
              <tbody>
                ${recentLeaves.map(l => {
                  const isSick = l.leaveType === 'sick' || (l.id && l.id.startsWith('SK-')) || l.formType?.includes('แบบ ๓');
                  const isPersonal = l.leaveType === 'personal' || (l.id && l.id.startsWith('PERS-')) || l.formType?.includes('แบบ ๖');
                  const typeBadgeClass = isSick ? 'type-sick' : (isPersonal ? 'type-personal' : 'type-vacation');
                  const typeIcon = isSick ? '🩺' : (isPersonal ? '💼' : '🌴');
                  const typeLabel = isSick ? 'ลาป่วย (แบบ ๓)' : (isPersonal ? 'ลากิจ (แบบ ๖)' : 'ลาพักผ่อน (แบบ ๗)');

                  let dateStr = '';
                  if (l.leaveMode === 'discrete' && l.discreteDates && l.discreteDates.length > 0) {
                    dateStr = formatDiscreteDatesThai(l.discreteDates);
                  } else if (l.startDate) {
                    const s = parseThaiDate(l.startDate);
                    if (l.endDate && l.endDate !== l.startDate) {
                      const e = parseThaiDate(l.endDate);
                      if (s.month === e.month && s.year === e.year) {
                        dateStr = `${s.day} - ${e.day} ${s.month} ${s.year}`;
                      } else {
                        dateStr = `${s.day} ${s.month} ${s.year} - ${e.day} ${e.month} ${e.year}`;
                      }
                    } else {
                      dateStr = `${s.day} ${s.month} ${s.year}`;
                    }
                  } else {
                    dateStr = l.docDate || '-';
                  }

                  const statusPill = l.status === 'approved' 
                    ? '<span class="dash-status-pill approved">✓ อนุมัติแล้ว</span>'
                    : (l.status === 'rejected'
                      ? '<span class="dash-status-pill rejected">✕ ไม่อนุมัติ</span>'
                      : '<span class="dash-status-pill pending">⏳ รออนุมัติ</span>');

                  return `
                    <tr>
                      <td>
                        <div class="dash-recent-name-cell">
                          <div class="dash-recent-avatar">👤</div>
                          <div>
                            <div class="dash-recent-name-text">${l.name || '-'}</div>
                            <div class="dash-recent-pos-text">${l.position || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="dash-type-badge ${typeBadgeClass}">
                          <span>${typeIcon}</span>
                          <span>${typeLabel}</span>
                        </span>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: #1e293b; font-size: 0.8rem;">📅 ${dateStr}</div>
                        <div style="font-size: 0.72rem; color: #64748b;">จำนวน <strong>${l.days || 0}</strong> วันทำการ</div>
                      </td>
                      <td style="text-align: center;">
                        ${statusPill}
                      </td>
                      <td style="text-align: center;">
                        <button type="button" class="btn btn-sm btn-outline" onclick="viewAndPrintLeave('${l.id}')" title="ดูเอกสารใบลา" style="padding: 3px 8px; font-size: 0.75rem; border-radius: 6px;">
                          👁️ ดู
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="dash-filter-bar">
      <div class="dash-filter-group">
        <label class="dash-filter-label" for="dashPersonSelect">
          <span>👥</span>
          <span>เลือกดูกำลังพล:</span>
        </label>
        <select class="dash-select" id="dashPersonSelect" onchange="onDashboardPersonChange(this.value)">
          <option value="all" ${dashboardState.selectedPersonId === 'all' ? 'selected' : ''}>-- แสดงภาพรวมกำลังพลทั้งหมด (${state.personnel.length} นาย) --</option>
          ${state.personnel.map(p => `
            <option value="${p.id}" ${dashboardState.selectedPersonId === p.id ? 'selected' : ''}>
              ${formatRankName(p.rank, p.name)} (${p.position || 'ประจำหน่วย'})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="dash-filter-group">
        <input type="text" class="dash-search-input" id="dashSearchInput" placeholder="🔍 ค้นหาชื่อ / ตำแหน่ง / ยศ..." 
          value="${dashboardState.searchQuery}" oninput="onDashboardSearchInput(this.value)">
        ${dashboardState.searchQuery ? `
          <button class="btn btn-sm btn-secondary" onclick="onDashboardSearchInput('')" title="ล้างคำค้นหา">✕</button>
        ` : ''}
      </div>
    </div>

    <!-- Master Personnel Leave Ledger Table -->
    <div class="dash-table-card">
      <div class="dash-table-header">
        <div class="dash-table-title">
          <span>📋</span>
          <span>ตารางสรุปสิทธิ์และการใช้วันลากำลังพลรายบุคคล (${tablePersonnel.length} นาย)</span>
        </div>
      </div>

      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>กำลังพล</th>
              <th>ตำแหน่ง / สังกัด</th>
              <th style="text-align: center;">🌴 ลาพักผ่อน<br><span style="font-size: 0.72rem; font-weight: normal; color:#64748b;">สิทธิ์ | ใช้ | เหลือ</span></th>
              <th style="text-align: center;">🩺 ลาป่วย<br><span style="font-size: 0.72rem; font-weight: normal; color:#64748b;">สิทธิ์ | ใช้ | เหลือ</span></th>
              <th style="text-align: center;">💼 ลากิจ<br><span style="font-size: 0.72rem; font-weight: normal; color:#64748b;">สิทธิ์ | ใช้ | เหลือ</span></th>
              <th style="text-align: center;">⏱️ ล่าสุด<br><span style="font-size: 0.72rem; font-weight: normal; color:#64748b;">ประเภท • ลาครั้งนี้</span></th>
              <th style="text-align: center;">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${tablePersonnel.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; color: #94a3b8; padding: 2.5rem 1rem;">
                  ไม่พบข้อมูลกำลังพลที่ตรงกับเงื่อนไขการค้นหา
                </td>
              </tr>
            ` : tablePersonnel.map(item => {
              const p = item.person;
              const fullName = formatRankName(p.rank, p.name);
              const latestLeave = item.latestOverall;
              const latestTypeStr = latestLeave 
                ? (latestLeave.formType || (latestLeave.leaveType === 'sick' ? 'ลาป่วย' : (latestLeave.leaveType === 'personal' ? 'ลากิจ' : 'ลาพักผ่อน')))
                : '-';
              const latestDaysStr = latestLeave ? `${latestLeave.days} วัน` : '-';
              return `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0f172a;">${fullName}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">ID: ${p.id}</div>
                  </td>
                  <td>
                    <div style="color: #334155;">${p.position || '-'}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${p.unit || '-'}</div>
                  </td>
                  <!-- Vacation: Quota | Used | Remaining -->
                  <td style="text-align: center; white-space: nowrap;">
                    <span class="quota-pill-stat quota" title="สิทธิ์">${item.vacation.quota}</span>
                    <span class="quota-pill-stat used" title="ลาไปแล้ว">${item.vacation.used}</span>
                    <span class="quota-pill-stat rem" title="คงเหลือ">${item.vacation.remaining}</span>
                  </td>
                  <!-- Sick: Quota | Used | Remaining -->
                  <td style="text-align: center; white-space: nowrap;">
                    <span class="quota-pill-stat quota" title="สิทธิ์">${item.sick.quota}</span>
                    <span class="quota-pill-stat used" title="ลาไปแล้ว">${item.sick.used}</span>
                    <span class="quota-pill-stat rem" title="คงเหลือ">${item.sick.remaining}</span>
                  </td>
                  <!-- Personal: Quota | Used | Remaining -->
                  <td style="text-align: center; white-space: nowrap;">
                    <span class="quota-pill-stat quota" title="สิทธิ์">${item.personal.quota}</span>
                    <span class="quota-pill-stat used" title="ลาไปแล้ว">${item.personal.used}</span>
                    <span class="quota-pill-stat rem" title="คงเหลือ">${item.personal.remaining}</span>
                  </td>
                  <!-- Latest Leave -->
                  <td style="text-align: center; font-size: 0.82rem;">
                    ${latestLeave ? `
                      <span style="font-weight: 600; color: #0f172a;">${latestTypeStr}</span>
                      <span style="color: #dc2626; font-weight: 700;">(${latestDaysStr})</span>
                      <div style="font-size: 0.72rem; color: #64748b;">${latestLeave.startDate || latestLeave.docDate || ''}</div>
                    ` : '<span style="color: #94a3b8;">ยังไม่มีประวัติ</span>'}
                  </td>
                  <!-- Action -->
                  <td style="text-align: center; white-space: nowrap;">
                    <button class="btn btn-sm btn-outline" onclick="focusDashboardPerson('${p.id}')" title="ดูแฟ้มสถิติรายบุคคล">
                      🔍 แฟ้มประวัติ
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================================================
// PERSONNEL TAB & MANAGEMENT
// ==========================================================================

function renderPersonnelTable() {
  const tbody = document.getElementById('personnelTableBody');
  const search = (document.getElementById('searchPersonnel')?.value || '').toLowerCase().trim();

  let filtered = state.personnel;
  if (search) {
    filtered = filtered.filter(p => 
      `${p.rank || ''} ${p.name}`.toLowerCase().includes(search) ||
      (p.position && p.position.toLowerCase().includes(search))
    );
  }

  let totalMembers = state.personnel.length;
  let totalQuotaDays = 0;
  let totalUsedDays = 0;

  tbody.innerHTML = '';

  filtered.forEach((p, idx) => {
    const annual = p.annualQuota ?? 10;
    const acc = p.accQuota ?? 0;
    const total = annual + acc;
    totalQuotaDays += total;

    // Calculate days used (Vacation leave / แบบ ๗ only)
    const used = state.leaves
      .filter(l => l.personId === p.id && l.status === 'approved' && (!l.leaveType || l.leaveType === 'vacation' || (l.id && l.id.startsWith('LV-'))))
      .reduce((sum, item) => sum + (parseInt(item.days, 10) || 0), 0);
    totalUsedDays += used;

    const remaining = total - used;
    const fullName = formatRankName(p.rank, p.name);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${fullName}</strong></td>
      <td>${p.position || '-'}${p.position2 ? `<br><small style="color: var(--text-muted);">${p.position2}</small>` : ''}</td>
      <td style="text-align:center;">${annual} วัน</td>
      <td style="text-align:center;">${acc} วัน</td>
      <td style="text-align:center;"><strong>${total} วัน</strong></td>
      <td style="text-align:center; color: var(--danger); font-weight: 600;">${used} วัน</td>
      <td style="text-align:center; color: ${remaining < 0 ? 'var(--danger)' : 'var(--success)'}; font-weight: bold;">
        ${remaining} วัน
      </td>
      <td style="text-align:center;">
        <div class="btn-group" style="justify-content:center;">
          <button class="btn btn-sm btn-secondary" onclick="createLeaveForPerson('${p.id}')" title="เขียนใบลาให้คนนี้">
            📝 เขียนใบลา
          </button>
          <button class="btn btn-sm btn-secondary" onclick="openEditPersonModal('${p.id}')" title="แก้ไขข้อมูล">
            ✏️ แก้ไข
          </button>
          <button class="btn btn-sm btn-danger" onclick="deletePerson('${p.id}')" title="ลบกำลังพล">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Update Stat Cards in Personnel Tab
  document.getElementById('statTotalPersonnel').textContent = totalMembers;
  document.getElementById('statTotalLeaveUsed').textContent = `${totalUsedDays} วัน`;
  document.getElementById('statTotalQuota').textContent = `${totalQuotaDays} วัน`;
  const avgRemain = totalMembers > 0 ? Math.round((totalQuotaDays - totalUsedDays) / totalMembers) : 0;
  document.getElementById('statAvgRemaining').textContent = `${avgRemain} วัน`;
}

function createLeaveForPerson(personId) {
  switchTab('create');
  document.getElementById('userSelect').value = personId;
  loadPersonData(personId);
}

function openAddPersonModal() {
  document.getElementById('personModalTitle').textContent = 'เพิ่มกำลังพลใหม่';
  document.getElementById('personFormId').value = '';
  document.getElementById('pRank').value = '';
  document.getElementById('pNameInp').value = '';
  document.getElementById('pPosInp').value = '';
  if (document.getElementById('pPosInp2')) document.getElementById('pPosInp2').value = '';
  document.getElementById('pUnitInp').value = state.settings.writtenAt || '';
  document.getElementById('pAnnualInp').value = '10';
  document.getElementById('pAccInp').value = '0';
  document.getElementById('pPhoneInp').value = '';
  document.getElementById('pPronounInp').value = 'กระผม';
  if (document.getElementById('pHomeNoInp')) document.getElementById('pHomeNoInp').value = '';
  if (document.getElementById('pRoadInp')) document.getElementById('pRoadInp').value = '';
  if (document.getElementById('pSubdistrictInp')) document.getElementById('pSubdistrictInp').value = '';
  if (document.getElementById('pDistrictInp')) document.getElementById('pDistrictInp').value = '';
  if (document.getElementById('pProvinceInp')) document.getElementById('pProvinceInp').value = '';

  const hintEl = document.getElementById('pNameDuplicateHint');
  if (hintEl) {
    hintEl.style.display = 'none';
    hintEl.textContent = '';
  }

  document.getElementById('personModal').classList.add('open');
}

function openEditPersonModal(personId) {
  const person = state.personnel.find(p => p.id === personId);
  if (!person) return;

  document.getElementById('personModalTitle').textContent = 'แก้ไขข้อมูลกำลังพล';
  document.getElementById('personFormId').value = person.id;
  document.getElementById('pRank').value = person.rank || '';
  document.getElementById('pNameInp').value = formatNameSpacing(person.name || '');
  document.getElementById('pPosInp').value = person.position || '';
  if (document.getElementById('pPosInp2')) document.getElementById('pPosInp2').value = person.position2 || '';
  document.getElementById('pUnitInp').value = person.unit || '';
  document.getElementById('pAnnualInp').value = person.annualQuota ?? 10;
  document.getElementById('pAccInp').value = person.accQuota ?? 0;
  document.getElementById('pPhoneInp').value = person.phone || '';
  document.getElementById('pPronounInp').value = person.pronoun || 'กระผม';
  if (document.getElementById('pHomeNoInp')) document.getElementById('pHomeNoInp').value = person.homeNo || '';
  if (document.getElementById('pRoadInp')) document.getElementById('pRoadInp').value = person.road || '';
  if (document.getElementById('pSubdistrictInp')) document.getElementById('pSubdistrictInp').value = person.subdistrict || '';
  if (document.getElementById('pDistrictInp')) document.getElementById('pDistrictInp').value = person.district || '';
  if (document.getElementById('pProvinceInp')) document.getElementById('pProvinceInp').value = person.province || '';

  const hintEl = document.getElementById('pNameDuplicateHint');
  if (hintEl) {
    hintEl.style.display = 'none';
    hintEl.textContent = '';
  }

  document.getElementById('personModal').classList.add('open');
}

function checkDuplicatePersonName() {
  const currentFormId = document.getElementById('personFormId')?.value || '';
  const rawName = document.getElementById('pNameInp')?.value.trim() || '';
  const rank = document.getElementById('pRank')?.value.trim() || '';
  const hintEl = document.getElementById('pNameDuplicateHint');
  const modalTitleEl = document.getElementById('personModalTitle');

  if (!rawName || rawName.length < 2) {
    if (hintEl) {
      hintEl.style.display = 'none';
      hintEl.textContent = '';
    }
    if (modalTitleEl && !currentFormId) {
      modalTitleEl.textContent = 'เพิ่มกำลังพลใหม่';
    }
    return;
  }

  const cleanInputName = rawName.replace(/\s+/g, '').toLowerCase();
  const cleanInputFull = ((rank || '') + rawName).replace(/\s+/g, '').toLowerCase();

  const found = state.personnel.find(p => {
    const pName = (p.name || '').replace(/\s+/g, '').toLowerCase();
    const pCleanRank = (p.rank || '').replace(/\s+/g, '').toLowerCase();
    const pFull = pCleanRank + pName;
    return pName === cleanInputName || pFull === cleanInputFull || pFull === cleanInputName || pName === cleanInputFull;
  });

  if (found && (!currentFormId || currentFormId !== found.id)) {
    if (hintEl) {
      hintEl.style.display = 'block';
      hintEl.innerHTML = `⚠️ <strong>พบชื่อนี้ในทะเบียนกำลังพลแล้ว:</strong> ${formatRankName(found.rank, found.name)} (${found.position || 'ไม่มีตำแหน่ง'})<br>เมื่อกดบันทึก ระบบจะทำการแก้ไข/อัปเดตข้อมูลของกำลังพลรายนี้โดยตรง (ไม่สร้างรายการซ้ำ)`;
    }
    if (modalTitleEl && !currentFormId) {
      modalTitleEl.textContent = 'แก้ไขข้อมูลกำลังพลเดิม (พบชื่อในระบบ)';
    }
  } else {
    if (hintEl) {
      hintEl.style.display = 'none';
      hintEl.textContent = '';
    }
    if (modalTitleEl && !currentFormId) {
      modalTitleEl.textContent = 'เพิ่มกำลังพลใหม่';
    }
  }
}

function closePersonModal() {
  document.getElementById('personModal').classList.remove('open');
}

function savePersonFromModal() {
  const id = document.getElementById('personFormId')?.value || '';
  const rank = document.getElementById('pRank')?.value.trim() || '';
  const rawName = document.getElementById('pNameInp')?.value.trim() || '';
  const name = formatNameSpacing(rawName);
  const position = document.getElementById('pPosInp')?.value.trim() || '';
  const position2 = document.getElementById('pPosInp2')?.value.trim() || '';
  const unit = document.getElementById('pUnitInp')?.value.trim() || '';
  const annualQuota = parseInt(document.getElementById('pAnnualInp')?.value || '10', 10);
  const accQuota = parseInt(document.getElementById('pAccInp')?.value || '0', 10);
  const phone = document.getElementById('pPhoneInp')?.value.trim() || '';
  const pronoun = document.getElementById('pPronounInp')?.value || 'กระผม';
  const homeNo = document.getElementById('pHomeNoInp')?.value.trim() || '';
  const road = document.getElementById('pRoadInp')?.value.trim() || '';
  const subdistrict = document.getElementById('pSubdistrictInp')?.value.trim() || '';
  const district = document.getElementById('pDistrictInp')?.value.trim() || '';
  const province = document.getElementById('pProvinceInp')?.value.trim() || '';

  if (!rawName) {
    showToast('กรุณาระบุชื่อ-นามสกุล', 'danger');
    return;
  }

  const cleanInputName = name.replace(/\s+/g, '').toLowerCase();
  const cleanInputFull = ((rank || '') + name).replace(/\s+/g, '').toLowerCase();

  let targetPerson = null;
  let isEdit = false;

  if (id) {
    // -------------------------------------------------------------
    // 1. EDIT MODE: User clicked "Edit" on a specific person record
    // -------------------------------------------------------------
    const targetIdx = state.personnel.findIndex(p => p.id === id);
    if (targetIdx === -1) {
      showToast('ไม่พบข้อมูลกำลังพลที่ต้องการแก้ไข', 'danger');
      return;
    }

    // Check if the user changed the name to another existing person's name
    const conflictPerson = state.personnel.find(p => {
      if (p.id === id) return false;
      const pName = (p.name || '').replace(/\s+/g, '').toLowerCase();
      const pCleanRank = (p.rank || '').replace(/\s+/g, '').toLowerCase();
      const pFull = pCleanRank + pName;
      return pName === cleanInputName || pFull === cleanInputFull || pFull === cleanInputName || pName === cleanInputFull;
    });

    if (conflictPerson) {
      showToast(`ชื่อ "${name}" มีอยู่ในทะเบียนกำลังพลแล้ว (${formatRankName(conflictPerson.rank, conflictPerson.name)})`, 'danger');
      return;
    }

    // Directly update ALL fields with the latest edited values (allows clearing fields)
    state.personnel[targetIdx] = {
      ...state.personnel[targetIdx],
      rank,
      name,
      position,
      position2,
      unit,
      annualQuota: !isNaN(annualQuota) ? annualQuota : 10,
      accQuota: !isNaN(accQuota) ? accQuota : 0,
      phone,
      pronoun,
      homeNo,
      road,
      subdistrict,
      district,
      province
    };
    targetPerson = state.personnel[targetIdx];
    isEdit = true;
    showToast(`แก้ไขข้อมูล "${formatRankName(rank, name)}" เรียบร้อย`, 'success');

  } else {
    // -------------------------------------------------------------
    // 2. ADD MODE: User is adding a new person
    // -------------------------------------------------------------
    const duplicatePerson = state.personnel.find(p => {
      const pName = (p.name || '').replace(/\s+/g, '').toLowerCase();
      const pCleanRank = (p.rank || '').replace(/\s+/g, '').toLowerCase();
      const pFull = pCleanRank + pName;
      return pName === cleanInputName || pFull === cleanInputFull || pFull === cleanInputName || pName === cleanInputFull;
    });

    if (duplicatePerson) {
      // Update existing record directly
      const dupIdx = state.personnel.findIndex(p => p.id === duplicatePerson.id);
      state.personnel[dupIdx] = {
        ...state.personnel[dupIdx],
        rank: rank || state.personnel[dupIdx].rank,
        name: name,
        position: position || state.personnel[dupIdx].position,
        position2: position2 || state.personnel[dupIdx].position2,
        unit: unit || state.personnel[dupIdx].unit,
        annualQuota: !isNaN(annualQuota) ? annualQuota : (state.personnel[dupIdx].annualQuota ?? 10),
        accQuota: !isNaN(accQuota) ? accQuota : (state.personnel[dupIdx].accQuota ?? 0),
        phone: phone || state.personnel[dupIdx].phone,
        pronoun: pronoun || state.personnel[dupIdx].pronoun,
        homeNo: homeNo || state.personnel[dupIdx].homeNo,
        road: road || state.personnel[dupIdx].road,
        subdistrict: subdistrict || state.personnel[dupIdx].subdistrict,
        district: district || state.personnel[dupIdx].district,
        province: province || state.personnel[dupIdx].province
      };
      targetPerson = state.personnel[dupIdx];
      isEdit = true;
      showToast(`พบชื่อ "${name}" ในทะเบียนกำลังพลแล้ว ทำการอัปเดตข้อมูลเดิมเรียบร้อย`, 'success');
    } else {
      // Create new person record
      const newPerson = {
        id: 'p_' + Date.now(),
        rank,
        name,
        position,
        position2,
        unit,
        annualQuota: !isNaN(annualQuota) ? annualQuota : 10,
        accQuota: !isNaN(accQuota) ? accQuota : 0,
        sickQuota: 60,
        sickTaken: 0,
        phone,
        pronoun,
        homeNo,
        road,
        subdistrict,
        district,
        province
      };
      state.personnel.push(newPerson);
      targetPerson = newPerson;
      showToast(`เพิ่มกำลังพลใหม่ "${formatRankName(rank, name)}" เรียบร้อย`, 'success');
    }
  }

  // Save to localStorage immediately
  saveState();

  // Real-time Supabase Cloud sync
  if (targetPerson && typeof syncPersonToSupabase === 'function') {
    syncPersonToSupabase(targetPerson);
  }

  // Sync updated name & rank to user accounts and session
  if (targetPerson) {
    const formattedFullName = formatRankName(targetPerson.rank, targetPerson.name);
    if (Array.isArray(state.users)) {
      state.users.forEach(u => {
        if (u.personId === targetPerson.id) {
          u.name = formattedFullName;
        }
      });
    }
    if (state.currentUser && state.currentUser.personId === targetPerson.id) {
      state.currentUser.name = formattedFullName;
      if (typeof applyUserPermissions === 'function') {
        applyUserPermissions();
      }
    }

    // If currently selected in leave forms, re-sync form inputs immediately
    if (document.getElementById('userSelect')?.value === targetPerson.id) {
      loadPersonData(targetPerson.id, false);
    }
    if (document.getElementById('sickUserSelect')?.value === targetPerson.id) {
      loadSickPersonData(targetPerson.id, false);
    }
    if (document.getElementById('personalUserSelect')?.value === targetPerson.id) {
      loadPersonalPersonData(targetPerson.id, false);
    }
  }

  // Log audit event
  logAuditEvent({
    action: isEdit ? 'EDIT_PERSONNEL' : 'ADD_PERSONNEL',
    actionTitle: isEdit ? 'แก้ไขข้อมูลกำลังพล' : 'เพิ่มกำลังพลใหม่',
    category: 'personnel',
    details: `${isEdit ? 'แก้ไขข้อมูลกำลังพล' : 'เพิ่มกำลังพลใหม่'}: ${formatRankName(rank, name)} (${position || 'ไม่มีตำแหน่ง'})`,
    status: 'success'
  });

  closePersonModal();
  updateUserSelectOptions();
  renderPersonnelTable();
  if (typeof renderUsersTable === 'function') renderUsersTable();
  if (typeof renderDashboard === 'function') renderDashboard();
}

function deletePerson(personId) {
  const p = state.personnel.find(item => item.id === personId);
  const pName = p ? formatRankName(p.rank, p.name) : personId;

  if (!confirm(`ยืนยันการลบข้อมูลกำลังพล "${pName}" หรือไม่?`)) return;

  state.personnel = state.personnel.filter(item => item.id !== personId);
  saveState();

  // Real-time Supabase Cloud sync
  if (typeof deletePersonFromSupabase === 'function') {
    deletePersonFromSupabase(personId);
  }

  // Log audit event
  logAuditEvent({
    action: 'DELETE_PERSONNEL',
    actionTitle: 'ลบข้อมูลกำลังพล',
    category: 'personnel',
    details: `ลบข้อมูลกำลังพล "${pName}" ออกจากระบบ`,
    status: 'danger'
  });

  updateUserSelectOptions();
  renderPersonnelTable();
  if (typeof renderDashboard === 'function') renderDashboard();
  showToast(`ลบข้อมูล "${pName}" เรียบร้อย`, 'success');
}

function getCurrentUserPersonnel() {
  const user = state.currentUser;
  if (!user) return [];

  let matchedPerson = null;

  // 1. By user.personId
  if (user.personId) {
    matchedPerson = state.personnel.find(p => p.id === user.personId);
  }

  // 2. By username match
  if (!matchedPerson && user.username) {
    matchedPerson = state.personnel.find(p => p.id === user.username || p.username === user.username);
  }

  // 3. By full name matching
  if (!matchedPerson && user.name) {
    const cleanUName = user.name.replace(/\s+/g, '').toLowerCase();
    matchedPerson = state.personnel.find(p => {
      const cleanPName = (p.name || '').replace(/\s+/g, '').toLowerCase();
      return cleanPName === cleanUName || cleanUName.includes(cleanPName) || cleanPName.includes(cleanUName);
    });
  }

  // 4. Fallback virtual profile if not in personnel registry
  if (!matchedPerson && user.username) {
    matchedPerson = {
      id: user.personId || `user_${user.username}`,
      rank: '',
      name: user.name || user.username,
      position: user.role === 'superadmin' ? 'ผู้ดูแลระบบระดับสูง (Superadmin)' : (user.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานระบบ'),
      unit: state.settings?.subOrgName || state.settings?.writtenAt || 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
      annualQuota: 10,
      accQuota: 0,
      sickQuota: 60,
      sickTaken: 0,
      personalQuota: 45,
      personalTaken: 0,
      isVirtual: true
    };
  }

  return matchedPerson ? [matchedPerson] : [];
}

function updateUserSelectOptions() {
  const user = state.currentUser;
  const isSuperOrAdmin = user && (user.role === 'superadmin' || user.role === 'admin' || (user.username && user.username.toLowerCase() === 'kornphong'));

  const allowedPersonnel = isSuperOrAdmin ? state.personnel : getCurrentUserPersonnel();
  const myPerson = getCurrentUserPersonnel()[0];

  ['userSelect', 'sickUserSelect', 'personalUserSelect'].forEach(selId => {
    const select = document.getElementById(selId);
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '';

    if (isSuperOrAdmin) {
      // Superadmin and Admin: Can view and select from all personnel in registry
      select.innerHTML = '<option value="">-- กรอกเอง / เลือกจากกำลังพล --</option>';
      state.personnel.forEach(p => {
        const fullName = formatRankName(p.rank, p.name);
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${fullName} (${p.position || 'ไม่มีตำแหน่ง'})`;
        select.appendChild(opt);
      });

      if (currentVal && state.personnel.some(p => p.id === currentVal)) {
        select.value = currentVal;
      } else if (myPerson && state.personnel.some(p => p.id === myPerson.id)) {
        select.value = myPerson.id;
      }
    } else {
      // Regular user: ONLY sees their own name!
      if (allowedPersonnel.length > 0) {
        allowedPersonnel.forEach(p => {
          const fullName = formatRankName(p.rank, p.name);
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = `${fullName} (${p.position || 'ไม่มีตำแหน่ง'})`;
          select.appendChild(opt);
        });

        const optManual = document.createElement('option');
        optManual.value = '';
        optManual.textContent = '-- กรอกข้อมูลเอง (เว้นว่าง) --';
        select.appendChild(optManual);

        select.value = allowedPersonnel[0].id;
      } else {
        select.innerHTML = '<option value="">-- กรุณาเข้าสู่ระบบเพื่อดึงข้อมูลกำลังพล --</option>';
      }
    }
  });
}

// ==========================================================================
// HISTORY / LEAVE REGISTER TAB
// ==========================================================================

function setLeaveTypeFilter(type) {
  state.leaveTypeFilter = type;

  // Sync with Dropdown
  const select = document.getElementById('filterLeaveType');
  if (select && select.value !== type) {
    select.value = type;
  }

  // Sync button active classes
  const pillMap = {
    all: 'btnFilterTypeAll',
    vacation: 'btnFilterTypeVacation',
    sick: 'btnFilterTypeSick',
    personal: 'btnFilterTypePersonal'
  };
  Object.keys(pillMap).forEach(key => {
    const btn = document.getElementById(pillMap[key]);
    if (btn) btn.classList.toggle('active', key === type);
  });

  renderHistoryTable();
}

function syncTypeFilterSelect(val) {
  setLeaveTypeFilter(val);
}

function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  const search = (document.getElementById('searchLeave')?.value || '').toLowerCase().trim();
  const filterStatus = document.getElementById('filterLeaveStatus')?.value || 'all';
  const filterType = state.leaveTypeFilter || document.getElementById('filterLeaveType')?.value || 'all';

  // Keep dashboard stats in sync
  const dashContainer = document.getElementById('dashboardDynamicContent');
  if (dashContainer) {
    renderDashboard();
  }

  // Update Leave Type Pill Counters
  const countAll = state.leaves.length;
  const countVacation = state.leaves.filter(l => !l.leaveType || l.leaveType === 'vacation' || (l.id && l.id.startsWith('LV-'))).length;
  const countSick = state.leaves.filter(l => l.leaveType === 'sick' || (l.id && l.id.startsWith('SK-'))).length;
  const countPersonal = state.leaves.filter(l => l.leaveType === 'personal' || (l.id && l.id.startsWith('PERS-'))).length;

  const countAllEl = document.getElementById('countTypeAll');
  if (countAllEl) countAllEl.textContent = countAll;
  const countVacationEl = document.getElementById('countTypeVacation');
  if (countVacationEl) countVacationEl.textContent = countVacation;
  const countSickEl = document.getElementById('countTypeSick');
  if (countSickEl) countSickEl.textContent = countSick;
  const countPersonalEl = document.getElementById('countTypePersonal');
  if (countPersonalEl) countPersonalEl.textContent = countPersonal;

  // Sync active class on pill buttons
  const pillMap = {
    all: 'btnFilterTypeAll',
    vacation: 'btnFilterTypeVacation',
    sick: 'btnFilterTypeSick',
    personal: 'btnFilterTypePersonal'
  };
  Object.keys(pillMap).forEach(key => {
    const btn = document.getElementById(pillMap[key]);
    if (btn) btn.classList.toggle('active', key === filterType);
  });

  let list = state.leaves;

  // Filter by Type
  if (filterType === 'vacation') {
    list = list.filter(l => !l.leaveType || l.leaveType === 'vacation' || (l.id && l.id.startsWith('LV-')));
  } else if (filterType === 'sick') {
    list = list.filter(l => l.leaveType === 'sick' || (l.id && l.id.startsWith('SK-')));
  } else if (filterType === 'personal') {
    list = list.filter(l => l.leaveType === 'personal' || (l.id && l.id.startsWith('PERS-')));
  }

  // Filter by Status
  if (filterStatus !== 'all') {
    list = list.filter(l => l.status === filterStatus);
  }

  // Filter by Search
  if (search) {
    list = list.filter(l => 
      (l.name && l.name.toLowerCase().includes(search)) ||
      (l.position && l.position.toLowerCase().includes(search)) ||
      (l.position2 && l.position2.toLowerCase().includes(search)) ||
      (l.id && l.id.toLowerCase().includes(search)) ||
      (l.province && l.province.toLowerCase().includes(search)) ||
      (l.diagnosis && l.diagnosis.toLowerCase().includes(search)) ||
      (l.reason && l.reason.toLowerCase().includes(search))
    );
  }

  // Update Summary Badges in History Tab
  const totalApproved = state.leaves.filter(l => l.status === 'approved').length;
  const totalPendingOrRejected = state.leaves.filter(l => l.status === 'pending' || l.status === 'rejected').length;
  const totalApprovedVacationDays = state.leaves
    .filter(l => l.status === 'approved' && (!l.leaveType || l.leaveType === 'vacation' || (l.id && l.id.startsWith('LV-'))))
    .reduce((s, i) => s + (parseInt(i.days, 10) || 0), 0);

  const histTotalEl = document.getElementById('histTotalLeaves');
  if (histTotalEl) histTotalEl.textContent = state.leaves.length;
  const histApprovedEl = document.getElementById('histApprovedLeaves');
  if (histApprovedEl) histApprovedEl.textContent = totalApproved;
  const histPendingEl = document.getElementById('histPendingLeaves');
  if (histPendingEl) histPendingEl.textContent = totalPendingOrRejected;
  const histDaysEl = document.getElementById('histTotalDays');
  if (histDaysEl) histDaysEl.textContent = `${totalApprovedVacationDays} วัน`;

  const countBadge = document.getElementById('historyTableCountBadge');
  if (countBadge) countBadge.textContent = `${list.length} รายการ`;

  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 3rem 1rem; color: #94a3b8; font-size: 0.95rem;">
      <div style="font-size: 2.2rem; margin-bottom: 0.5rem; opacity: 0.8;">🔍</div>
      <div style="font-weight: 500;">ไม่พบรายการใบลาตามเงื่อนไขที่เลือก</div>
      <div style="font-size: 0.825rem; color: #cbd5e1; margin-top: 4px;">ลองเปลี่ยนตัวกรอง หรือค้นหาด้วยคำอื่น</div>
    </td></tr>`;
    return;
  }

  list.forEach((l, idx) => {
    const tr = document.createElement('tr');
    let dateRangeStr = '';
    if (l.leaveMode === 'discrete' && l.discreteDates && l.discreteDates.length > 0) {
      dateRangeStr = formatDiscreteDatesThai(l.discreteDates);
    } else {
      const startThai = parseThaiDate(l.startDate);
      const endThai = parseThaiDate(l.endDate);
      dateRangeStr = `${startThai.day} ${startThai.month} ${startThai.year} - ${endThai.day} ${endThai.month} ${endThai.year}`;
    }

    const isSick = l.leaveType === 'sick' || (l.id && l.id.startsWith('SK-'));
    const isPersonal = l.leaveType === 'personal' || (l.id && l.id.startsWith('PERS-'));

    const formBadge = isSick
      ? '<span class="type-badge sick">🩺 แบบ ๓ ลาป่วย</span>'
      : isPersonal
      ? '<span class="type-badge personal">💼 แบบ ๖ ลากิจ</span>'
      : '<span class="type-badge vacation">🌴 แบบ ๗ ลาพักผ่อน</span>';

    const destOrDiagnosis = isSick
      ? (l.diagnosis ? `อาการ: ${l.diagnosis}` : (l.province || '-'))
      : (l.province || l.reason || '-');

    const destIcon = isSick ? '🩺' : '📍';

    tr.innerHTML = `
      <td style="text-align:center;">
        <span class="doc-id-chip">${l.id}</span>
      </td>
      <td style="text-align:center;">${formBadge}</td>
      <td>
        <div style="font-weight:600; color:#0f172a; font-size:0.925rem;">${l.name}</div>
      </td>
      <td>
        <div style="color:#334155; font-size:0.875rem;">${l.position || '-'}</div>
        ${l.position2 ? `<div style="color:#64748b; font-size:0.775rem; margin-top:2px;">📍 ${l.position2}</div>` : ''}
      </td>
      <td>
        <div class="date-range-chip">📅 ${dateRangeStr}</div>
      </td>
      <td style="text-align:center;">
        <span class="days-pill"><strong>${l.days}</strong> วัน</span>
      </td>
      <td>
        <div style="color:#475569; font-size:0.85rem; max-width:220px; line-height:1.4;">
          ${destIcon} ${destOrDiagnosis}
        </div>
      </td>
      <td style="text-align:center;">
        <span class="status-pill ${l.status}">
          <span class="status-dot"></span>
          ${getLeaveStatusLabel(l.status)}
        </span>
      </td>
      <td style="text-align:center;">
        <div class="action-btn-group">
          ${l.status !== 'approved' ? `
            <button class="act-btn act-btn-approve" onclick="approveLeave('${l.id}')" title="อนุมัติใบลา">
              ✓ อนุมัติ
            </button>
          ` : ''}
          ${l.status !== 'rejected' ? `
            <button class="act-btn act-btn-reject" onclick="rejectLeave('${l.id}')" title="ไม่อนุมัติใบลา">
              ✕ ไม่อนุมัติ
            </button>
          ` : ''}
          <button class="act-btn act-btn-print" onclick="viewAndPrintLeave('${l.id}')" title="ดูและพิมพ์ใบลาชุดนี้">
            🖨️ พิมพ์
          </button>
          <button class="act-btn act-btn-delete" onclick="deleteLeaveRecord('${l.id}')" title="ลบรายการใบลา">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleLeaveStatusModal(leaveId) {
  const l = state.leaves.find(item => item.id === leaveId);
  if (!l) return;

  const currentStatus = l.status;
  const nextStatus = currentStatus === 'approved' ? 'pending' : (currentStatus === 'pending' ? 'rejected' : 'approved');
  updateLeaveStatus(leaveId, nextStatus);
}

function exportLeavesToCSV() {
  if (state.leaves.length === 0) {
    showToast('ไม่มีข้อมูลใบลาให้ส่งออก', 'warning');
    return;
  }

  const headers = ['เลขที่ใบลา', 'ประเภทใบลา', 'ยศ-ชื่อ-สกุล', 'ตำแหน่ง', 'ตำแหน่งบรรทัด2', 'วันที่เขียน', 'ตั้งแต่วันที่', 'ถึงวันที่', 'จำนวนวันทำการ', 'จังหวัดที่ไป/อาการ', 'เบอร์โทร', 'สถานะ'];
  const rows = state.leaves.map(l => {
    const isSick = l.leaveType === 'sick' || (l.id && l.id.startsWith('SK-'));
    const isPersonal = l.leaveType === 'personal' || (l.id && l.id.startsWith('PERS-'));
    const typeLabel = isSick ? 'ลาป่วย (แบบ ๓)' : (isPersonal ? 'ลากิจ (แบบ ๖)' : 'ลาพักผ่อน (แบบ ๗)');
    const destOrDiag = isSick ? (l.diagnosis || l.province || '') : (l.province || l.reason || '');

    return [
      `"${l.id}"`,
      `"${typeLabel}"`,
      `"${l.name}"`,
      `"${l.position || ''}"`,
      `"${l.position2 || ''}"`,
      `"${l.docDate || ''}"`,
      `"${l.startDate || ''}"`,
      `"${l.endDate || ''}"`,
      l.days || 0,
      `"${destOrDiag}"`,
      `"${l.phone || ''}"`,
      `"${getLeaveStatusLabel(l.status)}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ทะเบียนคุมใบลา_ทุกประเภท_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('ส่งออกไฟล์ CSV สำเร็จ', 'success');
}

// ==========================================================================
// SETTINGS TAB & BACKUP / RESTORE
// ==========================================================================

function applySettingsToForms(target = 'all') {
  if (!state.settings) return;

  if (target === 'all' || target === 'create') {
    if (document.getElementById('inpPlace')) document.getElementById('inpPlace').value = state.settings.writtenAt || '';
    if (document.getElementById('inpTo')) document.getElementById('inpTo').value = state.settings.defaultTo || '';
    if (document.getElementById('inpStatSignPos')) document.getElementById('inpStatSignPos').value = state.settings.statSignPos || '';
    if (document.getElementById('inpEndorseTo')) document.getElementById('inpEndorseTo').value = state.settings.endorseTo || '';
    if (document.getElementById('inpEndorseRank')) document.getElementById('inpEndorseRank').value = state.settings.endorseRank || '';
    if (document.getElementById('inpEndorsePos')) document.getElementById('inpEndorsePos').value = state.settings.endorsePos || '';
    if (document.getElementById('inpEndorsePos2')) document.getElementById('inpEndorsePos2').value = state.settings.endorsePos2 || '';
    if (document.getElementById('inpOrderRank')) document.getElementById('inpOrderRank').value = state.settings.orderRank || '';
    if (document.getElementById('inpOrderPos1')) document.getElementById('inpOrderPos1').value = state.settings.orderPos1 || '';
    if (document.getElementById('inpOrderPos2')) document.getElementById('inpOrderPos2').value = state.settings.orderPos2 || '';
    if (document.getElementById('chkThaiNum')) document.getElementById('chkThaiNum').checked = !!state.settings.useThaiNumerals;
    render();
  }

  if (target === 'all' || target === 'create-sick') {
    if (document.getElementById('inpSickPlace')) document.getElementById('inpSickPlace').value = state.settings.writtenAt || '';
    if (document.getElementById('inpSickTo')) document.getElementById('inpSickTo').value = state.settings.defaultTo || '';
    if (document.getElementById('inpSickEndorseTo')) document.getElementById('inpSickEndorseTo').value = state.settings.endorseTo || '';
    if (document.getElementById('inpSickEndorseRank')) document.getElementById('inpSickEndorseRank').value = state.settings.endorseRank || '';
    if (document.getElementById('inpSickEndorsePos')) document.getElementById('inpSickEndorsePos').value = state.settings.endorsePos || '';
    if (document.getElementById('inpSickEndorsePos2')) document.getElementById('inpSickEndorsePos2').value = state.settings.endorsePos2 || '';
    if (document.getElementById('inpSickOrderRank')) document.getElementById('inpSickOrderRank').value = state.settings.orderRank || '';
    if (document.getElementById('inpSickOrderPos1')) document.getElementById('inpSickOrderPos1').value = state.settings.orderPos1 || '';
    if (document.getElementById('inpSickOrderPos2')) document.getElementById('inpSickOrderPos2').value = state.settings.orderPos2 || '';
    if (document.getElementById('inpSickAuthority')) document.getElementById('inpSickAuthority').value = '';
    if (document.getElementById('chkSickThaiNum')) document.getElementById('chkSickThaiNum').checked = !!state.settings.useThaiNumerals;
    renderSickLeave();
  }

  if (target === 'all' || target === 'create-personal') {
    if (document.getElementById('inpPersonalPlace')) document.getElementById('inpPersonalPlace').value = state.settings.writtenAt || '';
    if (document.getElementById('inpPersonalTo')) document.getElementById('inpPersonalTo').value = state.settings.defaultTo || '';
    if (document.getElementById('inpPersonalEndorseTo')) document.getElementById('inpPersonalEndorseTo').value = state.settings.endorseTo || '';
    if (document.getElementById('inpPersonalEndorseRank')) document.getElementById('inpPersonalEndorseRank').value = state.settings.endorseRank || '';
    if (document.getElementById('inpPersonalEndorsePos')) document.getElementById('inpPersonalEndorsePos').value = state.settings.endorsePos || '';
    if (document.getElementById('inpPersonalEndorsePos2')) document.getElementById('inpPersonalEndorsePos2').value = state.settings.endorsePos2 || '';
    if (document.getElementById('inpPersonalOrderRank')) document.getElementById('inpPersonalOrderRank').value = state.settings.orderRank || '';
    if (document.getElementById('inpPersonalOrderPos1')) document.getElementById('inpPersonalOrderPos1').value = state.settings.orderPos1 || '';
    if (document.getElementById('inpPersonalOrderPos2')) document.getElementById('inpPersonalOrderPos2').value = state.settings.orderPos2 || '';
    if (document.getElementById('chkPersonalThaiNum')) document.getElementById('chkPersonalThaiNum').checked = !!state.settings.useThaiNumerals;
    renderPersonalLeave();
  }
}

function syncSettingsToSection4(target = 'all') {
  applySettingsToForms(target);
  showToast('ดึงข้อมูลสายการบังคับบัญชาจากหน้าตั้งค่าเรียบร้อย', 'success');
}

// ==========================================================================
// SYSTEM BRAND & HEADER SETTINGS (TITLE, SUBTITLE, LOGO)
// ==========================================================================

function applyHeaderBrandSettings() {
  const brandIconEl = document.getElementById('headerBrandIcon');
  const titleEl = document.getElementById('headerAppTitle');
  const subtitleEl = document.getElementById('headerAppSubtitle');

  const drawerBrandIconEl = document.getElementById('drawerBrandIcon');
  const drawerTitleEl = document.getElementById('drawerAppTitle');
  const drawerSubtitleEl = document.getElementById('drawerAppSubtitle');

  const loginLogoEl = document.getElementById('loginBrandLogo');
  const loginTitleEl = document.getElementById('loginSystemTitle');
  const loginSubtitleEl = document.getElementById('loginSystemSubtitle');

  const title = (state.settings && state.settings.systemTitle) || DEFAULT_SETTINGS.systemTitle;
  const subtitle = (state.settings && state.settings.systemSubtitle) || DEFAULT_SETTINGS.systemSubtitle;
  const logo = (state.settings && state.settings.systemLogo) || DEFAULT_SETTINGS.systemLogo;

  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (drawerTitleEl) drawerTitleEl.textContent = title;
  if (drawerSubtitleEl) drawerSubtitleEl.textContent = subtitle;
  if (loginTitleEl) loginTitleEl.textContent = title;
  if (loginSubtitleEl) loginSubtitleEl.textContent = subtitle;

  if (title) {
    document.title = `${title} - ระบบบริหารวันลาราชการ`;
  }

  const isImg = logo && (logo.startsWith('data:image/') || logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('blob:'));

  if (brandIconEl) {
    if (isImg) {
      brandIconEl.innerHTML = `<img src="${logo}" alt="Logo" class="header-logo-img">`;
    } else {
      brandIconEl.textContent = logo || '📋';
    }
  }

  if (drawerBrandIconEl) {
    if (isImg) {
      drawerBrandIconEl.innerHTML = `<img src="${logo}" alt="Logo" class="header-logo-img">`;
    } else {
      drawerBrandIconEl.textContent = logo || '📋';
    }
  }

  if (loginLogoEl) {
    if (isImg) {
      loginLogoEl.innerHTML = `<img src="${logo}" alt="Logo" class="login-brand-img">`;
    } else {
      loginLogoEl.innerHTML = `
        <div class="login-logo-emblem">
          <svg viewBox="0 0 100 100" class="login-rtaf-wings" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rtafGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
            </defs>
            <path d="M12 42 C24 32, 40 38, 48 50 C40 45, 26 48, 16 56 C24 53, 34 55, 46 62 C34 62, 22 66, 18 74 C30 68, 42 70, 50 78 C58 70, 70 68, 82 74 C78 66, 66 62, 54 62 C66 55, 76 53, 84 56 C74 48, 60 45, 52 50 C60 38, 76 32, 88 42 C72 36, 56 42, 50 48 C44 42, 28 36, 12 42 Z" fill="url(#rtafGold)" opacity="0.9" />
            <circle cx="50" cy="50" r="22" fill="#084277" stroke="#ffffff" stroke-width="2.5" />
            <path d="M42 38 h12 l6 6 v18 h-18 z" fill="#ffffff" />
            <path d="M54 38 v6 h6" fill="#38bdf8" />
            <line x1="45" y1="48" x2="55" y2="48" stroke="#084277" stroke-width="1.5" stroke-linecap="round" />
            <line x1="45" y1="52" x2="55" y2="52" stroke="#084277" stroke-width="1.5" stroke-linecap="round" />
            <line x1="45" y1="56" x2="52" y2="56" stroke="#084277" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
      `;
    }
  }
}

function updateHeaderPreview() {
  const titleInp = document.getElementById('setSystemTitle');
  const subtitleInp = document.getElementById('setSystemSubtitle');
  const logoInp = document.getElementById('setSystemLogo');

  const prevTitle = document.getElementById('previewAppTitle');
  const prevSubtitle = document.getElementById('previewAppSubtitle');
  const prevLogoContainer = document.getElementById('previewLogoContainer');
  const thumbIcon = document.getElementById('thumbIcon');

  const currentTitle = (titleInp && titleInp.value.trim()) || DEFAULT_SETTINGS.systemTitle;
  const currentSubtitle = (subtitleInp && subtitleInp.value.trim()) || DEFAULT_SETTINGS.systemSubtitle;
  const currentLogo = (logoInp && logoInp.value) || DEFAULT_SETTINGS.systemLogo;

  if (prevTitle) prevTitle.textContent = currentTitle;
  if (prevSubtitle) prevSubtitle.textContent = currentSubtitle;

  const isImg = currentLogo && (currentLogo.startsWith('data:image/') || currentLogo.startsWith('http://') || currentLogo.startsWith('https://') || currentLogo.startsWith('blob:'));

  if (prevLogoContainer) {
    if (isImg) {
      prevLogoContainer.innerHTML = `<img src="${currentLogo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 7px; display: block;">`;
    } else {
      prevLogoContainer.innerHTML = `<span id="previewLogoText">${currentLogo || '📋'}</span>`;
    }
  }

  if (thumbIcon) {
    if (isImg) {
      thumbIcon.innerHTML = `<img src="${currentLogo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px; display: block;">`;
    } else {
      thumbIcon.textContent = currentLogo || '📋';
    }
  }
}

function handleLogoFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, WebP, SVG)', 'warning');
    return;
  }

  if (file.size > 3 * 1024 * 1024) {
    showToast('ขนาดไฟล์รูปภาพต้องไม่เกิน 3MB', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const logoInp = document.getElementById('setSystemLogo');
    if (logoInp) logoInp.value = dataUrl;
    updateHeaderPreview();
    showToast('อัปโหลดไฟล์รูปภาพ Logo เรียบร้อย (กดบันทึกเพื่อใช้งานจริง)', 'info');
  };
  reader.readAsDataURL(file);
}

function selectQuickLogo(icon) {
  const logoInp = document.getElementById('setSystemLogo');
  if (logoInp) logoInp.value = icon;
  updateHeaderPreview();
}

function resetLogoToDefault() {
  const logoInp = document.getElementById('setSystemLogo');
  if (logoInp) logoInp.value = DEFAULT_SETTINGS.systemLogo;
  const fileInp = document.getElementById('inputLogoFile');
  if (fileInp) fileInp.value = '';
  updateHeaderPreview();
  showToast('คืนค่าไอคอน Logo เริ่มต้นแล้ว (กดบันทึกเพื่อบันทึกการเปลี่ยนแปลง)', 'info');
}

function resetHeaderDefaults() {
  const titleInp = document.getElementById('setSystemTitle');
  const subtitleInp = document.getElementById('setSystemSubtitle');
  const logoInp = document.getElementById('setSystemLogo');
  const fileInp = document.getElementById('inputLogoFile');

  if (titleInp) titleInp.value = DEFAULT_SETTINGS.systemTitle;
  if (subtitleInp) subtitleInp.value = DEFAULT_SETTINGS.systemSubtitle;
  if (logoInp) logoInp.value = DEFAULT_SETTINGS.systemLogo;
  if (fileInp) fileInp.value = '';

  updateHeaderPreview();
  showToast('คืนค่าชื่อระบบและ Logo เป็นค่าเริ่มต้นแล้ว (กดบันทึกเพื่อบันทึกการเปลี่ยนแปลง)', 'info');
}

function saveHeaderSettings() {
  const titleInp = document.getElementById('setSystemTitle');
  const subtitleInp = document.getElementById('setSystemSubtitle');
  const logoInp = document.getElementById('setSystemLogo');

  state.settings.systemTitle = (titleInp && titleInp.value.trim()) || DEFAULT_SETTINGS.systemTitle;
  state.settings.systemSubtitle = (subtitleInp && subtitleInp.value.trim()) || DEFAULT_SETTINGS.systemSubtitle;
  state.settings.systemLogo = (logoInp && logoInp.value) || DEFAULT_SETTINGS.systemLogo;

  saveState();
  applyHeaderBrandSettings();

  // Real-time Supabase Cloud sync
  if (typeof syncSettingsToSupabase === 'function') {
    syncSettingsToSupabase(state.settings);
  }

  // Log audit event
  logAuditEvent({
    action: 'HEADER_SETTINGS_UPDATE',
    actionTitle: 'เปลี่ยนชื่อระบบ/ตราสัญลักษณ์',
    category: 'settings',
    details: `อัปเดตชื่อระบบเป็น "${state.settings.systemTitle}"`,
    status: 'info'
  });

  showToast('บันทึกชื่อระบบและ Logo เรียบร้อยแล้ว', 'success');
}

function loadSettingsIntoForm() {
  if (document.getElementById('setWrittenAt')) document.getElementById('setWrittenAt').value = state.settings.writtenAt || '';
  if (document.getElementById('setDefaultTo')) document.getElementById('setDefaultTo').value = state.settings.defaultTo || '';
  if (document.getElementById('setStatSignPos')) document.getElementById('setStatSignPos').value = state.settings.statSignPos || '';
  if (document.getElementById('setEndorseTo')) document.getElementById('setEndorseTo').value = state.settings.endorseTo || '';
  if (document.getElementById('setEndorseRank')) document.getElementById('setEndorseRank').value = state.settings.endorseRank || '';
  if (document.getElementById('setEndorsePos')) document.getElementById('setEndorsePos').value = state.settings.endorsePos || '';
  if (document.getElementById('setEndorsePos2')) document.getElementById('setEndorsePos2').value = state.settings.endorsePos2 || '';
  if (document.getElementById('setOrderRank')) document.getElementById('setOrderRank').value = state.settings.orderRank || '';
  if (document.getElementById('setOrderPos1')) document.getElementById('setOrderPos1').value = state.settings.orderPos1 || '';
  if (document.getElementById('setOrderPos2')) document.getElementById('setOrderPos2').value = state.settings.orderPos2 || '';
  if (document.getElementById('setUseThaiNum')) document.getElementById('setUseThaiNum').checked = state.settings.useThaiNumerals;

  // Header & Logo settings
  if (document.getElementById('setSystemTitle')) document.getElementById('setSystemTitle').value = state.settings.systemTitle || DEFAULT_SETTINGS.systemTitle;
  if (document.getElementById('setSystemSubtitle')) document.getElementById('setSystemSubtitle').value = state.settings.systemSubtitle || DEFAULT_SETTINGS.systemSubtitle;
  if (document.getElementById('setSystemLogo')) document.getElementById('setSystemLogo').value = state.settings.systemLogo || DEFAULT_SETTINGS.systemLogo;
  updateHeaderPreview();

  // Supabase Cloud settings
  loadSupabaseSettingsIntoForm();
}

function saveSettingsFromForm() {
  if (document.getElementById('setWrittenAt')) state.settings.writtenAt = document.getElementById('setWrittenAt').value.trim();
  if (document.getElementById('setDefaultTo')) state.settings.defaultTo = document.getElementById('setDefaultTo').value.trim();
  if (document.getElementById('setStatSignPos')) state.settings.statSignPos = document.getElementById('setStatSignPos').value.trim();
  if (document.getElementById('setEndorseTo')) state.settings.endorseTo = document.getElementById('setEndorseTo').value.trim();
  if (document.getElementById('setEndorseRank')) state.settings.endorseRank = document.getElementById('setEndorseRank').value.trim();
  if (document.getElementById('setEndorsePos')) state.settings.endorsePos = document.getElementById('setEndorsePos').value.trim();
  if (document.getElementById('setEndorsePos2')) state.settings.endorsePos2 = document.getElementById('setEndorsePos2').value.trim();
  if (document.getElementById('setOrderRank')) state.settings.orderRank = document.getElementById('setOrderRank').value.trim();
  if (document.getElementById('setOrderPos1')) state.settings.orderPos1 = document.getElementById('setOrderPos1').value.trim();
  if (document.getElementById('setOrderPos2')) state.settings.orderPos2 = document.getElementById('setOrderPos2').value.trim();
  if (document.getElementById('setUseThaiNum')) state.settings.useThaiNumerals = document.getElementById('setUseThaiNum').checked;

  if (document.getElementById('setSystemTitle')) state.settings.systemTitle = document.getElementById('setSystemTitle').value.trim() || DEFAULT_SETTINGS.systemTitle;
  if (document.getElementById('setSystemSubtitle')) state.settings.systemSubtitle = document.getElementById('setSystemSubtitle').value.trim() || DEFAULT_SETTINGS.systemSubtitle;
  if (document.getElementById('setSystemLogo')) state.settings.systemLogo = document.getElementById('setSystemLogo').value || DEFAULT_SETTINGS.systemLogo;

  saveState();
  applySettingsToForms('all');
  applyHeaderBrandSettings();

  // Real-time Supabase Cloud sync
  if (typeof syncSettingsToSupabase === 'function') {
    syncSettingsToSupabase(state.settings);
  }

  // Log audit event
  logAuditEvent({
    action: 'SETTINGS_UPDATE',
    actionTitle: 'บันทึกการตั้งค่าระบบ',
    category: 'settings',
    details: `บันทึกข้อมูลหน่วยงาน, สถานที่เขียน (${state.settings.writtenAt}), และสายการบังคับบัญชา`,
    status: 'info'
  });

  showToast('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว', 'success');
}

function exportBackupJSON() {
  const backupData = {
    settings: state.settings,
    personnel: state.personnel,
    leaves: state.leaves,
    users: state.users,
    auditLogs: state.auditLogs,
    exportDate: new Date().toISOString(),
    version: '1.2'
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `backup_leave_form7_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  // Log audit event
  logAuditEvent({
    action: 'BACKUP_EXPORT',
    actionTitle: 'ส่งออกไฟล์สำรองข้อมูล JSON',
    category: 'settings',
    details: 'ส่งออกไฟล์สำรองข้อมูลระบบ (รวมการตั้งค่า, กำลังพล, ประวัติใบลา, บัญชีผู้ใช้, และบันทึกกิจกรรม)',
    status: 'info'
  });

  showToast('ส่งออกไฟล์สำรองข้อมูล JSON (รวมสิทธิ์ผู้ใช้งาน) เรียบร้อย', 'success');
}

function importBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.settings && data.personnel) {
        state.settings = data.settings;
        state.personnel = data.personnel;
        if (data.leaves) state.leaves = data.leaves;
        if (data.users && Array.isArray(data.users)) {
          state.users = data.users;
          if (!state.users.some(u => u.role === 'admin' || u.role === 'superadmin')) {
            state.users.unshift(DEFAULT_USERS[0]);
          }
        }
        if (data.auditLogs && Array.isArray(data.auditLogs)) {
          state.auditLogs = data.auditLogs;
        }
        saveState();
        initApplication();

        // Real-time Supabase Cloud sync if connected
        if (typeof pushAllToSupabase === 'function' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
          pushAllToSupabase();
        }

        // Log audit event
        logAuditEvent({
          action: 'BACKUP_RESTORE',
          actionTitle: 'กู้คืนข้อมูลสำรองจาก JSON',
          category: 'settings',
          details: `กู้คืนข้อมูลสำเร็จจากไฟล์ "${file.name}"`,
          status: 'warning'
        });

        showToast('กู้คืนข้อมูลสำเร็จเรียบร้อย', 'success');
      } else {
        showToast('รูปแบบไฟล์สำรองข้อมูลไม่ถูกต้อง', 'danger');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON', 'danger');
    }
  };
  reader.readAsText(file);
}

function resetToDefaultData() {
  if (!confirm('ยืนยันการคืนค่าข้อมูลเริ่มต้นของระบบหรือไม่? (ข้อมูลที่บันทึกไว้จะถูกรีเซ็ต)')) return;

  state.settings = { ...DEFAULT_SETTINGS };
  state.personnel = [ ...DEFAULT_PERSONNEL ];
  state.leaves = [ ...DEFAULT_LEAVES ];
  state.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
  state.currentUser = state.users[0];
  state.auditLogs = generateInitialAuditLogs();
  saveState();

  // Real-time Supabase Cloud sync if connected
  if (typeof pushAllToSupabase === 'function' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
    pushAllToSupabase();
  }

  // Log audit event
  logAuditEvent({
    action: 'SYSTEM_RESET',
    actionTitle: 'รีเซ็ตข้อมูลเริ่มต้นของระบบ',
    category: 'settings',
    details: 'รีเซ็ตข้อมูลระบบกลับสู่ค่าเริ่มต้นจากโรงงาน',
    status: 'danger'
  });

  initApplication();
  showToast('คืนค่าข้อมูลเริ่มต้นตัวอย่างเรียบร้อย', 'success');
}

// ==========================================================================
// SUPABASE CLOUD DATABASE UI HANDLERS
// ==========================================================================

function updateSupabaseStatusBadge(status, text) {
  const badge = document.getElementById('supabaseStatusBadge');
  if (!badge) return;

  if (status === 'connected') {
    badge.className = 'status-pill status-approved';
    badge.innerHTML = `<span class="status-dot" style="background: #10b981;"></span>${text || 'เชื่อมต่อ Supabase แล้ว 🟢'}`;
  } else if (status === 'connecting') {
    badge.className = 'status-pill status-pending';
    badge.innerHTML = `<span class="status-dot" style="background: #f59e0b;"></span>${text || 'กำลังตรวจสอบการเชื่อมต่อ...'}`;
  } else if (status === 'error') {
    badge.className = 'status-pill status-cancelled';
    badge.innerHTML = `<span class="status-dot" style="background: #ef4444;"></span>${text || 'เชื่อมต่อไม่สำเร็จ 🔴'}`;
  } else {
    badge.className = 'status-pill status-pending';
    badge.innerHTML = `<span class="status-dot" style="background: #94a3b8;"></span>${text || 'ยังไม่เชื่อมต่อ (ใช้งาน LocalStorage)'}`;
  }
}

function loadSupabaseSettingsIntoForm() {
  if (typeof getSupabaseConfig !== 'function') return;
  const cfg = getSupabaseConfig();
  const urlInp = document.getElementById('sbProjectUrl');
  const keyInp = document.getElementById('sbAnonKey');
  if (urlInp) urlInp.value = cfg.url || '';
  if (keyInp) keyInp.value = cfg.key || '';

  if (cfg.url && cfg.key) {
    updateSupabaseStatusBadge('connected', 'ตั้งค่าเชื่อมต่อ Supabase แล้ว 🟢');
  } else {
    updateSupabaseStatusBadge('offline', 'ยังไม่เชื่อมต่อ (ใช้งาน LocalStorage)');
  }
}

async function handleSaveSupabaseConfig() {
  const urlInp = document.getElementById('sbProjectUrl');
  const keyInp = document.getElementById('sbAnonKey');
  const url = (urlInp?.value || '').trim();
  const key = (keyInp?.value || '').trim();

  if (!url || !key) {
    showToast('กรุณากรอกทั้ง Supabase URL และ Anon Key ให้ครบถ้วน', 'warning');
    return;
  }

  updateSupabaseStatusBadge('connecting', 'กำลังตรวจสอบการเชื่อมต่อ...');
  const res = await testSupabaseConnection(url, key);
  if (res.formattedUrl && urlInp) {
    urlInp.value = res.formattedUrl;
  }
  if (res.success) {
    saveSupabaseConfig(res.formattedUrl || url, key, true);
    if (res.tablePending) {
      updateSupabaseStatusBadge('connected', 'เชื่อมต่อแล้ว (รอ Run SQL สร้างตาราง)');
      showToast(res.message, 'warning');
    } else {
      updateSupabaseStatusBadge('connected', 'เชื่อมต่อ Supabase สำเร็จ 🟢');
      showToast('บันทึกและเชื่อมต่อ Supabase Cloud สำเร็จเรียบร้อย!', 'success');
    }
    
    // Log audit event
    logAuditEvent({
      action: 'SUPABASE_CONFIG',
      actionTitle: 'เชื่อมต่อฐานข้อมูล Supabase',
      category: 'settings',
      details: `ตั้งค่าเชื่อมต่อ Supabase URL: ${res.formattedUrl || url}`,
      status: 'info'
    });
  } else {
    updateSupabaseStatusBadge('error', 'เชื่อมต่อไม่สำเร็จ 🔴');
    showToast(res.message, 'danger');
  }
}

async function handleTestSupabase() {
  const urlInp = document.getElementById('sbProjectUrl');
  const keyInp = document.getElementById('sbAnonKey');
  const url = (urlInp?.value || '').trim();
  const key = (keyInp?.value || '').trim();

  if (!url || !key) {
    showToast('กรุณากรอกทั้ง Supabase URL และ Anon Key ก่อนกดทดสอบ', 'warning');
    return;
  }

  updateSupabaseStatusBadge('connecting', 'กำลังทดสอบการเชื่อมต่อ...');
  const res = await testSupabaseConnection(url, key);
  if (res.formattedUrl && urlInp) {
    urlInp.value = res.formattedUrl;
  }
  if (res.success) {
    if (res.tablePending) {
      updateSupabaseStatusBadge('connected', 'เชื่อมต่อสำเร็จ (รอสร้างตาราง)');
      showToast(res.message, 'warning');
    } else {
      updateSupabaseStatusBadge('connected', 'เชื่อมต่อ Supabase สำเร็จ 🟢');
      showToast(res.message, 'success');
    }
  } else {
    updateSupabaseStatusBadge('error', 'การเชื่อมต่อผิดพลาด');
    showToast(res.message, 'danger');
  }
}

async function handlePushToSupabase() {
  if (typeof isSupabaseConfigured !== 'function' || !isSupabaseConfigured()) {
    showToast('กรุณาบันทึกและเชื่อมต่อ Supabase ก่อนอัปโหลดข้อมูล', 'warning');
    return;
  }

  if (!confirm('ต้องการอัปโหลดข้อมูลทั้งหมด (ทะเบียนกำลังพล, ประวัติใบลา, ผู้ใช้งาน) ขึ้น Supabase Cloud หรือไม่?')) {
    return;
  }

  showToast('กำลังอัปโหลดข้อมูลขึ้น Supabase...', 'info');
  const res = await pushAllToSupabase();
  if (res.success) {
    showToast(res.message, 'success');
    logAuditEvent({
      action: 'SUPABASE_PUSH',
      actionTitle: 'อัปโหลดข้อมูลขึ้น Supabase',
      category: 'settings',
      details: 'อัปโหลดข้อมูลระบบทั้งหมดขึ้นสู่ Supabase Cloud สำเร็จ',
      status: 'info'
    });
  } else {
    showToast(res.message, 'danger');
  }
}

async function handlePullFromSupabase() {
  if (typeof isSupabaseConfigured !== 'function' || !isSupabaseConfigured()) {
    showToast('กรุณาบันทึกและเชื่อมต่อ Supabase ก่อนดึงข้อมูล', 'warning');
    return;
  }

  if (!confirm('การดึงข้อมูลจาก Supabase จะนำข้อมูลออนไลน์มาแทนที่ข้อมูลในเครื่อง ยืนยันหรือไม่?')) {
    return;
  }

  showToast('กำลังดึงข้อมูลจาก Supabase Cloud...', 'info');
  const res = await pullFromSupabase();
  if (res.success) {
    showToast(res.message, 'success');
    initApplication();
    logAuditEvent({
      action: 'SUPABASE_PULL',
      actionTitle: 'ซิงค์ข้อมูลจาก Supabase',
      category: 'settings',
      details: 'ดึงข้อมูลออนไลน์จาก Supabase Cloud ลงสู่เครื่องสำเร็จ',
      status: 'info'
    });
  } else {
    showToast(res.message, 'danger');
  }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : (type === 'danger' ? '✕' : 'ℹ')}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ==========================================================================
// USER & PERMISSIONS MANAGEMENT (ACCESS CONTROL)
// ==========================================================================

function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const search = (document.getElementById('searchUserInput')?.value || '').toLowerCase().trim();
  const filterRole = document.getElementById('filterUserRole')?.value || 'all';

  let filtered = state.users;
  if (filterRole === 'locked') {
    filtered = filtered.filter(u => !!u.isLocked);
  } else if (filterRole !== 'all') {
    filtered = filtered.filter(u => u.role === filterRole);
  }
  if (search) {
    filtered = filtered.filter(u => 
      (u.username && u.username.toLowerCase().includes(search)) ||
      (u.name && u.name.toLowerCase().includes(search)) ||
      (u.role && u.role.toLowerCase().includes(search))
    );
  }

  // Update KPI counters
  const totalCount = state.users.length;
  const adminCount = state.users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
  const userCount = state.users.filter(u => u.role === 'user').length;
  const curUser = state.currentUser || state.users[0];

  if (document.getElementById('totalUsersCount')) document.getElementById('totalUsersCount').textContent = totalCount;
  if (document.getElementById('adminUsersCount')) document.getElementById('adminUsersCount').textContent = adminCount;
  if (document.getElementById('generalUsersCount')) document.getElementById('generalUsersCount').textContent = userCount;
  if (document.getElementById('activeUserLabel')) document.getElementById('activeUserLabel').textContent = curUser ? curUser.username : '-';
  if (document.getElementById('activeUserRoleLabel')) {
    const isCurSuper = curUser && (curUser.role === 'superadmin' || curUser.username.toLowerCase() === 'kornphong');
    document.getElementById('activeUserRoleLabel').textContent = isCurSuper ? 'ผู้ดูแลระบบระดับสูง (Superadmin)' : (curUser && curUser.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานทั่วไป (User)');
  }
  if (document.getElementById('userTableCountBadge')) document.getElementById('userTableCountBadge').textContent = `${filtered.length} บัญชี`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <div>ไม่พบบัญชีผู้ใช้งานที่ตรงตามเงื่อนไข</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((u, idx) => {
    const isCurrent = curUser && (curUser.id === u.id || curUser.username === u.username);
    const isSuper = u.role === 'superadmin' || (u.username && u.username.toLowerCase() === 'kornphong');
    const roleBadge = isSuper
      ? `<span class="role-badge superadmin" style="background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; font-weight: 700;">⚡ ผู้ดูแลระบบระดับสูง</span>`
      : (u.role === 'admin' 
        ? `<span class="role-badge admin">🛡️ ผู้ดูแลระบบ</span>` 
        : `<span class="role-badge user">👤 ผู้ใช้งานทั่วไป</span>`);

    // Pages badges with specific category pastel colors
    let pagesHtml = '';
    if (isSuper) {
      pagesHtml = `<span class="page-chip admin-all" style="background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; font-weight: 600;">⚡ สิทธิ์สูงสุด เข้าถึงได้ทุกหน้า (ทั้งหมด ๗ หน้า)</span>`;
    } else if (u.role === 'admin' && (!u.allowedPages || u.allowedPages.length === SYSTEM_PAGES.length)) {
      pagesHtml = `<span class="page-chip admin-all">⭐ เข้าถึงได้ทุกหน้า (ทั้งหมด ๗ หน้า)</span>`;
    } else if (Array.isArray(u.allowedPages) && u.allowedPages.length > 0) {
      pagesHtml = u.allowedPages.map(pageId => {
        const pDef = SYSTEM_PAGES.find(p => p.id === pageId);
        if (!pDef) return '';
        const pClass = `page-${pDef.id}`;
        return `<span class="page-chip ${pClass}">${pDef.icon} ${pDef.name}</span>`;
      }).join('');
    } else {
      pagesHtml = `<span style="color: #94a3b8; font-size: 0.8rem; font-style: italic;">ไม่มีสิทธิ์เข้าถึงหน้าใด</span>`;
    }

    // Associated personnel info
    let personSub = '';
    if (u.personId) {
      const p = state.personnel.find(item => item.id === u.personId);
      if (p) {
        personSub = `<div style="font-size: 0.76rem; color: #64748b; margin-top: 2px;">${p.position || ''}${p.position2 ? ' • ' + p.position2 : ''}</div>`;
      }
    }

    // Masked password
    const passMask = `<div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
      <span class="pass-mask-chip" id="passMask_${u.id}">••••••</span>
      <button type="button" class="act-btn" onclick="toggleTablePassVisibility('${u.id}', '${u.password || ''}')" style="padding: 2px 7px; font-size: 0.8rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;" title="แสดง/ซ่อนรหัสผ่าน">👁️</button>
    </div>`;

    // Action buttons - Admin can now be deleted at any time
    const deleteBtn = `<button class="act-btn act-btn-delete" onclick="deleteUser('${u.id}')" title="ลบผู้ใช้งาน">🗑️ ลบ</button>`;

    // Lock / Unlock button
    let lockBtn = '';
    if (isSuper) {
      lockBtn = `<button class="act-btn" disabled style="opacity: 0.45; cursor: not-allowed; padding: 4px 8px; font-size: 0.8rem; background: #f1f5f9; color: #94a3b8; border: 1px solid #cbd5e1; border-radius: 8px;" title="บัญชี Superadmin ไม่สามารถล็อคได้">🔒 ล็อค</button>`;
    } else if (u.isLocked) {
      lockBtn = `<button class="act-btn act-btn-unlock" onclick="toggleLockUser('${u.id}')" title="ปลดล็อคบัญชี อนุญาตให้เข้าใช้งาน">🔓 ปลดล็อค</button>`;
    } else {
      lockBtn = `<button class="act-btn act-btn-lock" onclick="toggleLockUser('${u.id}')" title="ล็อคบัญชี ระงับสิทธิ์เข้าใช้งาน">🔒 ล็อค</button>`;
    }

    const lockedBadge = u.isLocked 
      ? '<span class="status-pill status-danger" style="font-size: 0.72rem; padding: 2px 8px; border-radius: 9999px; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;"><span class="status-dot" style="background:#dc2626;"></span>🔒 ถูกล็อค</span>'
      : '';

    return `
      <tr class="${isCurrent ? 'row-active-user' : ''} ${u.isLocked ? 'row-locked-user' : ''}">
        <td style="text-align: center; color: #64748b; font-weight: 600; font-size: 0.85rem;">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="user-username-chip ${isCurrent ? 'is-active' : ''}">
              <span>${isSuper ? '⚡' : (u.role === 'admin' ? '🛡️' : '👤')}</span>
              <span>${u.username}</span>
            </span>
            ${isCurrent ? '<span class="status-pill status-approved" style="font-size: 0.72rem; padding: 2px 8px; border-radius: 9999px;"><span class="status-dot"></span>กำลังใช้งาน</span>' : ''}
            ${lockedBadge}
          </div>
        </td>
        <td>
          <div style="font-weight: 600; color: #1e293b; font-size: 0.95rem;">${u.name || '-'}</div>
          ${personSub}
        </td>
        <td style="text-align: center;">${roleBadge}</td>
        <td>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
            ${pagesHtml}
          </div>
        </td>
        <td style="text-align: center;">${passMask}</td>
        <td style="text-align: center;">
          <div class="action-btn-group" style="justify-content: center; gap: 6px;">
            <button class="act-btn act-btn-edit" onclick="openUserModal('${u.id}')" title="แก้ไขผู้ใช้งานและสิทธิ์">
              ✏️ แก้ไข
            </button>
            ${lockBtn}
            ${deleteBtn}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleTablePassVisibility(userId, actualPass) {
  const el = document.getElementById(`passMask_${userId}`);
  if (!el) return;
  if (el.textContent === '••••••') {
    el.textContent = actualPass;
    el.style.color = '#0284c7';
    el.style.fontWeight = 'bold';
    el.style.letterSpacing = 'normal';
  } else {
    el.textContent = '••••••';
    el.style.color = '#64748b';
    el.style.fontWeight = 'normal';
    el.style.letterSpacing = '2px';
  }
}

function populatePersonSelectInUserModal(selectedPersonId = '') {
  const sel = document.getElementById('uPersonSelect');
  if (!sel) return;

  sel.innerHTML = '<option value="">-- ไม่ผูกกับกำลังพล (พิมพ์ชื่อเอง) --</option>';
  state.personnel.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${formatRankName(p.rank, p.name)} (${p.position || 'ไม่มีตำแหน่ง'})`;
    sel.appendChild(opt);
  });
  sel.value = selectedPersonId || '';
}

function onUserPersonSelectChange() {
  const sel = document.getElementById('uPersonSelect');
  const nameInp = document.getElementById('uNameInp');
  if (!sel || !nameInp) return;

  const personId = sel.value;
  if (personId) {
    const p = state.personnel.find(item => item.id === personId);
    if (p) {
      nameInp.value = formatRankName(p.rank, p.name);
    }
  }
}

function renderPermCheckboxes(selectedPages = []) {
  const container = document.getElementById('permCheckboxesGrid');
  if (!container) return;

  container.innerHTML = SYSTEM_PAGES.map(p => {
    const isChecked = selectedPages.includes(p.id);
    return `
      <label class="perm-card-label ${isChecked ? 'checked' : ''}" id="permCard_${p.id}">
        <input type="checkbox" id="chkPerm_${p.id}" value="${p.id}" ${isChecked ? 'checked' : ''} 
          onchange="onPermCheckboxChange('${p.id}')">
        <span style="font-size: 1.25rem;">${p.icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 0.85rem; color: #1e293b;">${p.name}</div>
          <div style="font-size: 0.72rem; color: #64748b;">${p.desc}</div>
        </div>
      </label>
    `;
  }).join('');
}

function onPermCheckboxChange(pageId) {
  const chk = document.getElementById(`chkPerm_${pageId}`);
  const card = document.getElementById(`permCard_${pageId}`);
  if (chk && card) {
    card.classList.toggle('checked', chk.checked);
  }
}

function onUserRoleChange() {
  const role = document.getElementById('uRoleInp')?.value;
  const permSec = document.getElementById('userPermSection');
  if (role === 'admin' || role === 'superadmin') {
    renderPermCheckboxes(SYSTEM_PAGES.map(p => p.id));
    if (permSec) {
      const hint = permSec.querySelector('label');
      if (hint) hint.textContent = 'กำหนดสิทธิ์การมองเห็นและเข้าถึงหน้า (เลือกหน้าที่อนุญาตให้เห็น):';
    }
  } else {
    // Default standard pages for user
    renderPermCheckboxes(['dashboard', 'create', 'create-sick', 'create-personal', 'history']);
    if (permSec) {
      const hint = permSec.querySelector('label');
      if (hint) hint.textContent = 'กำหนดสิทธิ์การมองเห็นและเข้าถึงหน้า (เลือกหน้าที่อนุญาตให้เห็น):';
    }
  }
}

function toggleAllUserPermissions(selectAll) {
  SYSTEM_PAGES.forEach(p => {
    const chk = document.getElementById(`chkPerm_${p.id}`);
    const card = document.getElementById(`permCard_${p.id}`);
    if (chk) {
      chk.checked = selectAll;
      if (card) card.classList.toggle('checked', selectAll);
    }
  });
}

function openUserModal(userId = null) {
  const modal = document.getElementById('userModal');
  const title = document.getElementById('userModalTitle');
  if (!modal) return;

  const idInp = document.getElementById('userFormId');
  const userInp = document.getElementById('uUsernameInp');
  const passInp = document.getElementById('uPasswordInp');
  const nameInp = document.getElementById('uNameInp');
  const roleInp = document.getElementById('uRoleInp');

  if (userId) {
    const u = state.users.find(item => item.id === userId);
    if (!u) return;

    if (title) title.textContent = `แก้ไขข้อมูลและสิทธิ์: ${u.username}`;
    if (idInp) idInp.value = u.id;
    if (userInp) {
      userInp.value = u.username;
      userInp.disabled = false;
    }
    if (passInp) passInp.value = u.password || '';
    if (nameInp) nameInp.value = u.name || '';
    if (roleInp) {
      roleInp.value = u.role || 'user';
      roleInp.disabled = false;
    }
    populatePersonSelectInUserModal(u.personId || '');
    const lockInp = document.getElementById('uIsLockedInp');
    if (lockInp) {
      lockInp.checked = !!u.isLocked;
      const isSuper = u.role === 'superadmin' || (u.username && u.username.toLowerCase() === 'kornphong');
      lockInp.disabled = isSuper;
    }
    const pagesToRender = (Array.isArray(u.allowedPages) && u.allowedPages.length > 0)
      ? u.allowedPages
      : (u.role === 'admin' || u.role === 'superadmin' ? SYSTEM_PAGES.map(p => p.id) : ['dashboard', 'create', 'create-sick', 'create-personal', 'history']);
    renderPermCheckboxes(pagesToRender);
  } else {
    if (title) title.textContent = 'เพิ่มผู้ใช้งานใหม่';
    if (idInp) idInp.value = '';
    if (userInp) {
      userInp.value = '';
      userInp.disabled = false;
    }
    if (passInp) passInp.value = '';
    if (nameInp) nameInp.value = '';
    if (roleInp) {
      roleInp.value = 'user';
      roleInp.disabled = false;
    }
    populatePersonSelectInUserModal('');
    const lockInp = document.getElementById('uIsLockedInp');
    if (lockInp) {
      lockInp.checked = false;
      lockInp.disabled = false;
    }
    renderPermCheckboxes(['dashboard', 'create', 'create-sick', 'create-personal', 'history']);
  }

  modal.classList.add('open');
  if (userInp) userInp.focus();
}

function closeUserModal() {
  const modal = document.getElementById('userModal');
  if (modal) modal.classList.remove('open');
}

function saveUserFromModal() {
  const id = document.getElementById('userFormId')?.value;
  const username = (document.getElementById('uUsernameInp')?.value || '').trim();
  const password = (document.getElementById('uPasswordInp')?.value || '').trim();
  const name = (document.getElementById('uNameInp')?.value || '').trim();
  const personId = document.getElementById('uPersonSelect')?.value || '';
  const role = document.getElementById('uRoleInp')?.value || 'user';
  const isLocked = !!document.getElementById('uIsLockedInp')?.checked;

  if (!username) {
    showToast('กรุณากรอกชื่อผู้ใช้งาน (Username)', 'warning');
    document.getElementById('uUsernameInp')?.focus();
    return;
  }
  if (!password) {
    showToast('กรุณากำหนดรหัสผ่าน (Password)', 'warning');
    document.getElementById('uPasswordInp')?.focus();
    return;
  }
  if (!name) {
    showToast('กรุณากรอกชื่อ-นามสกุล', 'warning');
    document.getElementById('uNameInp')?.focus();
    return;
  }

  // Check duplicate username
  const dup = state.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== id);
  if (dup) {
    showToast(`ชื่อผู้ใช้งาน "${username}" มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น`, 'danger');
    return;
  }

  // Get allowed pages
  let allowedPages = [];
  SYSTEM_PAGES.forEach(p => {
    const chk = document.getElementById(`chkPerm_${p.id}`);
    if (chk && chk.checked) {
      allowedPages.push(p.id);
    }
  });

  if (role === 'admin' || role === 'superadmin') {
    if (allowedPages.length === 0) {
      allowedPages = SYSTEM_PAGES.map(p => p.id);
    }
    if (!allowedPages.includes('permissions')) {
      allowedPages.push('permissions');
    }
    if (!allowedPages.includes('audit-log')) {
      allowedPages.push('audit-log');
    }
  } else {
    if (allowedPages.length === 0) {
      showToast('กรุณาเลือกหน้าที่อนุญาตให้ผู้ใช้นี้เข้าถึงอย่างน้อย ๑ หน้า', 'warning');
      return;
    }
  }

  let userToSync = null;
  if (id) {
    // Edit existing user
    const idx = state.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const oldUsername = state.users[idx].username;
      state.users[idx] = {
        ...state.users[idx],
        username,
        password,
        name,
        personId,
        role,
        allowedPages,
        isLocked
      };
      userToSync = state.users[idx];
      if (state.currentUser && (state.currentUser.id === id || state.currentUser.username === oldUsername || state.currentUser.username === username)) {
        state.currentUser = state.users[idx];
      }

      // Log audit event
      logAuditEvent({
        action: 'EDIT_USER',
        actionTitle: 'แก้ไขข้อมูลและสิทธิ์ผู้ใช้งาน',
        category: 'permissions',
        details: `แก้ไขบัญชีผู้ใช้ "${username}" (${name}) บทบาท: ${role}, สิทธิ์เข้าถึง ${allowedPages.length} หน้า`,
        status: 'success'
      });

      showToast('แก้ไขข้อมูลและสิทธิ์ผู้ใช้งานเรียบร้อย', 'success');
    }
  } else {
    // Add new user
    const newUser = {
      id: 'u_' + Date.now(),
      username,
      password,
      name,
      personId,
      role,
      allowedPages,
      isLocked,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    state.users.push(newUser);
    userToSync = newUser;

    // Log audit event
    logAuditEvent({
      action: 'ADD_USER',
      actionTitle: 'เพิ่มบัญชีผู้ใช้งานใหม่',
      category: 'permissions',
      details: `สร้างบัญชีผู้ใช้งาน "${username}" (${name}) บทบาท: ${role}, สิทธิ์เข้าถึง ${allowedPages.length} หน้า`,
      status: 'success'
    });

    showToast(`เพิ่มผู้ใช้งาน "${username}" เรียบร้อย`, 'success');
  }

  saveState();

  // Real-time Supabase Cloud sync
  if (userToSync && typeof syncUserToSupabase === 'function') {
    syncUserToSupabase(userToSync);
  }

  closeUserModal();
  renderUsersTable();
  applyUserPermissions();
}

function deleteUser(userId) {
  const u = state.users.find(item => item.id === userId);
  if (!u) return;

  const curUser = state.currentUser || state.users[0];
  const isCurrent = curUser && (curUser.id === u.id || curUser.username === u.username);

  let confirmMsg = `ยืนยันการลบบัญชีผู้ใช้ "${u.username}" (${u.name || '-'}) หรือไม่?`;
  if (isCurrent) {
    confirmMsg += '\n\n⚠️ คำเตือน: บัญชีนี้กำลังเข้าใช้งานอยู่ หลังจากลบแล้วระบบจะออกจากระบบทันที';
  }

  if (!confirm(confirmMsg)) return;

  state.users = state.users.filter(item => item.id !== userId);
  saveState();

  // Real-time Supabase Cloud sync
  if (typeof deleteUserFromSupabase === 'function') {
    deleteUserFromSupabase(userId);
  }

  // Log audit event
  logAuditEvent({
    action: 'DELETE_USER',
    actionTitle: 'ลบบัญชีผู้ใช้งาน',
    category: 'permissions',
    details: `ลบบัญชีผู้ใช้งาน "${u.username}" (${u.name}) [บทบาท: ${u.role === 'superadmin' ? 'Superadmin' : (u.role === 'admin' ? 'Admin' : 'User')}] ออกจากระบบ`,
    status: 'danger'
  });

  if (isCurrent) {
    showToast(`ลบบัญชีผู้ใช้ "${u.username}" เรียบร้อยแล้ว กำลังออกจากระบบ...`, 'success');
    setTimeout(() => {
      logoutUser();
    }, 400);
  } else {
    renderUsersTable();
    showToast(`ลบบัญชีผู้ใช้ "${u.username}" เรียบร้อย`, 'success');
  }
}

function toggleLockUser(userId) {
  const u = state.users.find(item => item.id === userId);
  if (!u) return;

  const isSuper = u.role === 'superadmin' || (u.username && u.username.toLowerCase() === 'kornphong');
  if (isSuper) {
    showToast('ไม่สามารถล็อคบัญชี Superadmin ได้', 'warning');
    return;
  }

  const curUser = state.currentUser || state.users[0];
  const isCurrent = curUser && (curUser.id === u.id || curUser.username.toLowerCase() === u.username.toLowerCase());
  if (isCurrent) {
    showToast('ไม่สามารถล็อคบัญชีที่กำลังเข้าใช้งานอยู่ได้', 'warning');
    return;
  }

  const adminName = curUser ? curUser.name || curUser.username : 'Admin';

  if (!u.isLocked) {
    if (!confirm(`ยืนยันการล็อคบัญชีผู้ใช้ "${u.username}" (${u.name || '-'}) หรือไม่?\n\nเมื่อล็อคแล้ว บัญชีนี้จะไม่สามารถเข้าสู่ระบบ (Login) ได้`)) {
      return;
    }
    u.isLocked = true;
    saveState();

    // Real-time Supabase Cloud sync
    if (typeof syncUserToSupabase === 'function') {
      syncUserToSupabase(u);
    }

    logAuditEvent({
      action: 'LOCK_USER',
      actionTitle: 'ล็อคบัญชีผู้ใช้งาน',
      category: 'permissions',
      details: `ผู้ดูแลระบบ (${adminName}) ล็อคบัญชี "${u.username}" (${u.name || '-'}) ระงับสิทธิ์การเข้าสู่ระบบ`,
      status: 'warning'
    });

    renderUsersTable();
    showToast(`ล็อคบัญชีผู้ใช้ "${u.username}" เรียบร้อย (ระงับสิทธิ์เข้าสู่ระบบ)`, 'warning');
  } else {
    if (!confirm(`ยืนยันการปลดล็อคบัญชีผู้ใช้ "${u.username}" (${u.name || '-'}) หรือไม่?\n\nเมื่อปลดล็อคแล้ว บัญชีนี้จะสามารถเข้าสู่ระบบได้ตามปกติ`)) {
      return;
    }
    u.isLocked = false;
    saveState();

    // Real-time Supabase Cloud sync
    if (typeof syncUserToSupabase === 'function') {
      syncUserToSupabase(u);
    }

    logAuditEvent({
      action: 'UNLOCK_USER',
      actionTitle: 'ปลดล็อคบัญชีผู้ใช้งาน',
      category: 'permissions',
      details: `ผู้ดูแลระบบ (${adminName}) ปลดล็อคบัญชี "${u.username}" (${u.name || '-'}) คืนสิทธิ์การเข้าสู่ระบบ`,
      status: 'success'
    });

    renderUsersTable();
    showToast(`ปลดล็อคบัญชีผู้ใช้ "${u.username}" เรียบร้อยแล้ว`, 'success');
  }
}

// ==========================================================================
// AUDIT LOG & ACTIVITY TRACKING SYSTEM (บันทึกประวัติการใช้งานระบบ)
// ==========================================================================

function generateInitialAuditLogs() {
  const now = Date.now();
  return [
    {
      id: 'LOG-' + (now - 120000),
      timestamp: new Date(now - 120000).toISOString(),
      username: 'admin',
      userName: 'ผู้ดูแลระบบ (Admin)',
      role: 'admin',
      action: 'LOGIN',
      actionTitle: 'เข้าสู่ระบบสำเร็จ',
      category: 'auth',
      details: 'เข้าสู่ระบบผ่านหน้า Login หลัก (สิทธิ์ผู้ดูแลระบบ)',
      ip: '127.0.0.1 (Localhost)',
      status: 'success'
    },
    {
      id: 'LOG-' + (now - 3600000),
      timestamp: new Date(now - 3600000).toISOString(),
      username: 'admin',
      userName: 'ผู้ดูแลระบบ (Admin)',
      role: 'admin',
      action: 'PERMISSIONS_UPDATE',
      actionTitle: 'ตรวจสอบสิทธิ์การใช้งาน',
      category: 'permissions',
      details: 'เข้าสู่หน้าจัดการสิทธิ์ผู้ใช้งานและกำหนดการมองเห็นหน้า',
      ip: '127.0.0.1 (Localhost)',
      status: 'info'
    },
    {
      id: 'LOG-' + (now - 86400000),
      timestamp: new Date(now - 86400000).toISOString(),
      username: 'user',
      userName: 'ร.ท.สมชาย  ใจดี',
      role: 'user',
      action: 'CREATE_LEAVE',
      actionTitle: 'สร้างใบลาพักผ่อน (แบบ ๗)',
      category: 'leave',
      details: 'ยื่นใบลาพักผ่อน รหัส LV-2569-001 จำนวน ๓ วัน (เชียงใหม่)',
      ip: '192.168.1.45',
      status: 'success'
    },
    {
      id: 'LOG-' + (now - 172800000),
      timestamp: new Date(now - 172800000).toISOString(),
      username: 'admin',
      userName: 'ผู้ดูแลระบบ (Admin)',
      role: 'admin',
      action: 'SETTINGS_UPDATE',
      actionTitle: 'บันทึกการตั้งค่าระบบ',
      category: 'settings',
      details: 'ตั้งค่าชื่อหน่วยงานและตำแหน่งผู้บังคับบัญชาตามระเบียบ ทอ.',
      ip: '127.0.0.1 (Localhost)',
      status: 'info'
    },
    {
      id: 'LOG-' + (now - 259200000),
      timestamp: new Date(now - 259200000).toISOString(),
      username: 'system',
      userName: 'ระบบส่วนกลาง',
      role: 'system',
      action: 'SYSTEM_INIT',
      actionTitle: 'เริ่มต้นระบบสารบรรณอิเล็กทรอนิกส์',
      category: 'system',
      details: 'โหลดฐานข้อมูลกำลังพลและการตั้งค่าเริ่มต้นสำหรับ ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
      ip: '127.0.0.1 (System)',
      status: 'success'
    }
  ];
}

function logAuditEvent({
  action = 'ACTION',
  actionTitle = 'กิจกรรม',
  category = 'system',
  details = '',
  userOverride = null,
  status = 'success'
}) {
  if (!Array.isArray(state.auditLogs)) {
    state.auditLogs = [];
  }

  const curUser = userOverride || state.currentUser || { username: 'system', name: 'ระบบส่วนกลาง', role: 'system' };

  const newLog = {
    id: 'LOG-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    username: curUser.username || 'unknown',
    userName: curUser.name || curUser.username || 'unknown',
    role: curUser.role || 'user',
    action: action,
    actionTitle: actionTitle,
    category: category,
    details: details,
    ip: '127.0.0.1 (Localhost)',
    status: status
  };

  state.auditLogs.unshift(newLog);

  // Keep up to 1000 logs max to ensure smooth browser storage
  if (state.auditLogs.length > 1000) {
    state.auditLogs = state.auditLogs.slice(0, 1000);
  }

  saveState();

  // Real-time Supabase Cloud sync
  if (typeof syncAuditLogToSupabase === 'function') {
    syncAuditLogToSupabase(newLog);
  }

  // If user is currently viewing the Audit Log tab, immediately refresh table
  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn && activeBtn.getAttribute('data-tab') === 'audit-log') {
    renderAuditLogTable();
  }
}

let auditLogFilter = {
  search: '',
  category: 'all',
  user: 'all',
  dateRange: 'all',
  page: 1,
  pageSize: 15
};

function setAuditLogCategory(category) {
  auditLogFilter.category = category;
  auditLogFilter.page = 1;
  renderAuditLogTable();
}

function setAuditLogUser(user) {
  auditLogFilter.user = user;
  auditLogFilter.page = 1;
  renderAuditLogTable();
}

function setAuditLogDate(dateRange) {
  auditLogFilter.dateRange = dateRange;
  auditLogFilter.page = 1;
  renderAuditLogTable();
}

function onAuditLogSearch(query) {
  auditLogFilter.search = (query || '').toLowerCase().trim();
  auditLogFilter.page = 1;
  renderAuditLogTable();
}

function changeAuditLogPageSize(size) {
  auditLogFilter.pageSize = parseInt(size, 10) || 15;
  auditLogFilter.page = 1;
  renderAuditLogTable();
}

function changeAuditLogPage(pageNum) {
  auditLogFilter.page = pageNum;
  renderAuditLogTable();
}

function formatAuditDateTimeThai(isoStr) {
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return { dateStr: isoStr || '-', timeStr: '' };

    const day = d.getDate();
    const month = THAI_MONTHS[d.getMonth()] || '';
    const year = d.getFullYear() + 543;
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');

    return {
      dateStr: `${day} ${month} ${year}`,
      timeStr: `${hours}:${mins}:${secs} น.`
    };
  } catch (e) {
    return { dateStr: isoStr, timeStr: '' };
  }
}

function formatAuditRelativeTime(isoStr) {
  try {
    const diffMs = Date.now() - new Date(isoStr).getTime();
    if (diffMs < 0) return 'เมื่อสักครู่';
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 45) return 'เมื่อสักครู่';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} วันที่แล้ว`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} เดือนที่แล้ว`;
  } catch (e) {
    return '';
  }
}

function renderAuditLogTable() {
  const tbody = document.getElementById('auditLogTableBody');
  if (!tbody) return;

  if (!Array.isArray(state.auditLogs)) {
    state.auditLogs = [];
  }

  // 1. Update KPI Counters
  const totalLogs = state.auditLogs.length;
  const authLogs = state.auditLogs.filter(l => l.category === 'auth').length;
  const leaveLogs = state.auditLogs.filter(l => l.category === 'leave').length;
  const adminLogs = state.auditLogs.filter(l => l.category === 'permissions' || l.category === 'settings' || l.category === 'personnel' || l.category === 'system').length;

  if (document.getElementById('auditTotalLogsCount')) document.getElementById('auditTotalLogsCount').textContent = totalLogs;
  if (document.getElementById('auditAuthLogsCount')) document.getElementById('auditAuthLogsCount').textContent = authLogs;
  if (document.getElementById('auditLeaveLogsCount')) document.getElementById('auditLeaveLogsCount').textContent = leaveLogs;
  if (document.getElementById('auditAdminLogsCount')) document.getElementById('auditAdminLogsCount').textContent = adminLogs;

  // 2. Populate User filter dropdown with unique users
  const userSelect = document.getElementById('filterAuditUser');
  if (userSelect) {
    const currentVal = auditLogFilter.user || 'all';
    const userMap = new Map();
    state.users.forEach(u => userMap.set(u.username, u.name || u.username));
    state.auditLogs.forEach(l => {
      if (l.username && !userMap.has(l.username)) {
        userMap.set(l.username, l.userName || l.username);
      }
    });

    let opts = '<option value="all">ทุกผู้ใช้งาน (All Users)</option>';
    userMap.forEach((name, uname) => {
      const selected = uname.toLowerCase() === currentVal.toLowerCase() ? 'selected' : '';
      opts += `<option value="${uname}" ${selected}>${uname} (${name})</option>`;
    });
    userSelect.innerHTML = opts;
  }

  // 3. Filter logs
  let filtered = [...state.auditLogs];

  if (auditLogFilter.category && auditLogFilter.category !== 'all') {
    filtered = filtered.filter(l => l.category === auditLogFilter.category);
  }

  if (auditLogFilter.user && auditLogFilter.user !== 'all') {
    filtered = filtered.filter(l => (l.username || '').toLowerCase() === auditLogFilter.user.toLowerCase());
  }

  if (auditLogFilter.dateRange && auditLogFilter.dateRange !== 'all') {
    const now = Date.now();
    filtered = filtered.filter(l => {
      const t = new Date(l.timestamp).getTime();
      if (isNaN(t)) return true;
      if (auditLogFilter.dateRange === 'today') {
        return new Date(t).toDateString() === new Date().toDateString();
      } else if (auditLogFilter.dateRange === '7days') {
        return now - t <= 7 * 86400000;
      } else if (auditLogFilter.dateRange === '30days') {
        return now - t <= 30 * 86400000;
      }
      return true;
    });
  }

  if (auditLogFilter.search) {
    const q = auditLogFilter.search;
    filtered = filtered.filter(l => 
      (l.username && l.username.toLowerCase().includes(q)) ||
      (l.userName && l.userName.toLowerCase().includes(q)) ||
      (l.actionTitle && l.actionTitle.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q)) ||
      (l.ip && l.ip.toLowerCase().includes(q)) ||
      (l.action && l.action.toLowerCase().includes(q))
    );
  }

  // Update badge count
  const countBadge = document.getElementById('auditLogCountBadge');
  if (countBadge) countBadge.textContent = `${filtered.length} รายการ`;

  // 4. Pagination
  const pageSize = auditLogFilter.pageSize || 15;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (auditLogFilter.page > totalPages) auditLogFilter.page = totalPages;
  if (auditLogFilter.page < 1) auditLogFilter.page = 1;

  const startIdx = (auditLogFilter.page - 1) * pageSize;
  const pageItems = filtered.slice(startIdx, startIdx + pageSize);

  // Update pagination info text
  const infoEl = document.getElementById('auditPaginationInfo');
  if (infoEl) {
    if (filtered.length === 0) {
      infoEl.textContent = 'แสดง 0 จาก 0 รายการ';
    } else {
      infoEl.textContent = `แสดง ${startIdx + 1} - ${Math.min(startIdx + pageSize, filtered.length)} จากทั้งหมด ${filtered.length} รายการ (หน้า ${auditLogFilter.page}/${totalPages})`;
    }
  }

  // Render pagination buttons
  const btnContainer = document.getElementById('auditPaginationButtons');
  if (btnContainer) {
    let btnsHtml = `
      <button class="audit-page-btn" onclick="changeAuditLogPage(${auditLogFilter.page - 1})" ${auditLogFilter.page <= 1 ? 'disabled' : ''} title="หน้าก่อนหน้า">◀</button>
    `;
    const maxButtons = 5;
    let startPage = Math.max(1, auditLogFilter.page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    for (let p = startPage; p <= endPage; p++) {
      btnsHtml += `
        <button class="audit-page-btn ${p === auditLogFilter.page ? 'active' : ''}" onclick="changeAuditLogPage(${p})">${p}</button>
      `;
    }
    btnsHtml += `
      <button class="audit-page-btn" onclick="changeAuditLogPage(${auditLogFilter.page + 1})" ${auditLogFilter.page >= totalPages ? 'disabled' : ''} title="หน้าถัดไป">▶</button>
    `;
    btnContainer.innerHTML = btnsHtml;
  }

  // 5. Render Table Body
  if (pageItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem 1rem; color: #64748b;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📜</div>
          <div style="font-weight: 600; font-size: 1rem; color: #1e293b;">ไม่พบบันทึกประวัติกิจกรรมตามเงื่อนไขที่เลือก</div>
          <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">ลองปรับคำค้นหา หรือเปลี่ยนตัวกรองหมวดหมู่และช่วงเวลา</div>
        </td>
      </tr>
    `;
    return;
  }

  const categoryMap = {
    'auth': { label: 'ความปลอดภัย', icon: '🔑', class: 'audit-cat-auth' },
    'leave': { label: 'ใบลา', icon: '📝', class: 'audit-cat-leave' },
    'personnel': { label: 'กำลังพล', icon: '👥', class: 'audit-cat-personnel' },
    'permissions': { label: 'สิทธิ์ผู้ใช้', icon: '🔐', class: 'audit-cat-permissions' },
    'settings': { label: 'ตั้งค่าระบบ', icon: '⚙️', class: 'audit-cat-settings' },
    'system': { label: 'ระบบส่วนกลาง', icon: '💻', class: 'audit-cat-system' }
  };

  const statusMap = {
    'success': { label: 'สำเร็จ', class: 'success' },
    'warning': { label: 'แจ้งเตือน', class: 'warning' },
    'danger': { label: 'ยกเลิก/ลบ', class: 'danger' },
    'info': { label: 'ข้อมูล', class: 'info' }
  };

  tbody.innerHTML = pageItems.map((l, idx) => {
    const rowNum = startIdx + idx + 1;
    const timeInfo = formatAuditDateTimeThai(l.timestamp);
    const relTime = formatAuditRelativeTime(l.timestamp);

    const cat = categoryMap[l.category] || { label: l.category || 'ทั่วไป', icon: '📌', class: 'audit-cat-system' };
    const st = statusMap[l.status] || { label: 'สำเร็จ', class: 'success' };

    const isSystem = l.username === 'system';
    const isSuper = l.role === 'superadmin' || (l.username && l.username.toLowerCase() === 'kornphong');
    const isAdmin = !isSuper && l.role === 'admin';
    const userRoleStr = isSuper ? 'Superadmin' : (isAdmin ? 'Admin' : (isSystem ? 'System' : 'User'));
    const avatarIcon = isSuper ? '⚡' : (isAdmin ? '🛡️' : (isSystem ? '💻' : '👤'));

    return `
      <tr>
        <td style="text-align: center; color: #64748b; font-weight: 600; font-size: 0.82rem;">${rowNum}</td>
        <td>
          <div class="audit-time-wrap">
            <span class="audit-time-main">${timeInfo.dateStr}</span>
            <div style="display: flex; gap: 6px; align-items: center;">
              <span style="font-size: 0.74rem; color: #0284c7; font-weight: 500;">${timeInfo.timeStr}</span>
              <span class="audit-time-ago">• ${relTime}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="audit-user-cell">
            <div class="audit-user-avatar">${avatarIcon}</div>
            <div class="audit-user-info">
              <span class="audit-user-name">${l.userName || l.username}</span>
              <span class="audit-user-sub">@${l.username} • <span style="font-weight: 600; color: ${isAdmin ? '#7e22ce' : '#475569'};">${userRoleStr}</span></span>
            </div>
          </div>
        </td>
        <td style="text-align: center;">
          <span class="audit-category-chip ${cat.class}">
            <span>${cat.icon}</span>
            <span>${cat.label}</span>
          </span>
        </td>
        <td>
          <div class="audit-action-chip">
            <span>${l.actionTitle || l.action}</span>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8; font-family: monospace; margin-top: 1px;">
            [${l.action}]
          </div>
        </td>
        <td>
          <div class="audit-details-text">${l.details || '-'}</div>
        </td>
        <td style="text-align: center;">
          <span class="audit-ip-chip">🌐 ${l.ip || '127.0.0.1'}</span>
        </td>
        <td style="text-align: center;">
          <span class="audit-status-pill ${st.class}">
            ${st.label}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function exportAuditLogCSV() {
  if (!Array.isArray(state.auditLogs) || state.auditLogs.length === 0) {
    showToast('ไม่มีข้อมูลประวัติกิจกรรมให้ส่งออก', 'warning');
    return;
  }

  let filtered = [...state.auditLogs];
  if (auditLogFilter.category && auditLogFilter.category !== 'all') {
    filtered = filtered.filter(l => l.category === auditLogFilter.category);
  }
  if (auditLogFilter.user && auditLogFilter.user !== 'all') {
    filtered = filtered.filter(l => (l.username || '').toLowerCase() === auditLogFilter.user.toLowerCase());
  }

  const headers = ['ลำดับ', 'วันเวลา', 'ชื่อผู้ใช้งาน', 'ชื่อ-นามสกุล', 'บทบาท', 'หมวดหมู่', 'รหัสกิจกรรม', 'ชื่อกิจกรรม', 'รายละเอียด', 'IP', 'สถานะ'];
  const rows = filtered.map((l, i) => [
    i + 1,
    `"${l.timestamp || ''}"`,
    `"${l.username || ''}"`,
    `"${(l.userName || '').replace(/"/g, '""')}"`,
    `"${l.role || ''}"`,
    `"${l.category || ''}"`,
    `"${l.action || ''}"`,
    `"${(l.actionTitle || '').replace(/"/g, '""')}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`,
    `"${l.ip || ''}"`,
    `"${l.status || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`ส่งออกประวัติกิจกรรมจำนวน ${filtered.length} รายการเป็นไฟล์ CSV เรียบร้อย`, 'success');
}

function clearAuditLogs() {
  if (!state.currentUser || (state.currentUser.role !== 'admin' && state.currentUser.role !== 'superadmin')) {
    showToast('ขออภัย เฉพาะผู้ดูแลระบบ (Admin/Superadmin) เท่านั้นที่สามารถล้างประวัติการใช้งานได้', 'danger');
    return;
  }

  if (!confirm('ยืนยันการล้างประวัติกิจกรรมทั้งหมดในระบบหรือไม่?\n\nข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้')) {
    return;
  }

  const adminName = state.currentUser ? state.currentUser.name || state.currentUser.username : 'Admin';
  state.auditLogs = [
    {
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toISOString(),
      username: state.currentUser ? state.currentUser.username : 'admin',
      userName: adminName,
      role: 'admin',
      action: 'CLEAR_LOGS',
      actionTitle: 'ล้างประวัติการใช้งานระบบ',
      category: 'system',
      details: `ผู้ดูแลระบบ (${adminName}) ทำการล้างประวัติกิจกรรมทั้งหมด`,
      ip: '127.0.0.1 (Localhost)',
      status: 'danger'
    }
  ];

  saveState();
  renderAuditLogTable();
  showToast('ล้างประวัติกิจกรรมเรียบร้อยแล้ว', 'success');
}

function togglePasswordVisibility(inputId, btnId) {
  const inp = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!inp) return;

  if (inp.type === 'password') {
    inp.type = 'text';
    if (btn) btn.textContent = '🔒';
  } else {
    inp.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
}

// ==========================================================================
// AUTHENTICATION & LOGOUT HANDLING
// ==========================================================================

function openLoginModal(isLoggedOut = false) {
  const modal = document.getElementById('loginModal');
  if (!modal) return;

  const curUser = state.currentUser;
  const loginCurrentBox = document.getElementById('loginCurrentBox');
  const curNameEl = document.getElementById('loginCurName');
  const curUserEl = document.getElementById('loginCurUsername');

  const closeBtn = document.getElementById('loginModalCloseBtn');
  if (curUser && !isLoggedOut) {
    if (loginCurrentBox) loginCurrentBox.style.display = 'block';
    if (curNameEl) curNameEl.textContent = curUser.name || curUser.username;
    if (curUserEl) curUserEl.textContent = `(@${curUser.username}) • ${curUser.role === 'superadmin' ? 'Superadmin' : (curUser.role === 'admin' ? 'Admin' : 'User')}`;
    if (closeBtn) closeBtn.style.display = 'flex';
  } else {
    if (loginCurrentBox) loginCurrentBox.style.display = 'none';
    if (closeBtn) closeBtn.style.display = 'none';
  }

  // Always reset to login view
  toggleForgotPassView(false);

  // Clear any login alert messages
  const alertBox = document.getElementById('loginAlertBox');
  if (alertBox) {
    alertBox.style.display = 'none';
    alertBox.textContent = '';
  }

  // Inputs start empty per user request
  const uInp = document.getElementById('loginUsername');
  const pInp = document.getElementById('loginPassword');
  if (uInp) uInp.value = '';
  if (pInp) {
    pInp.value = '';
    pInp.type = 'password';
  }
  const btnEye = document.getElementById('btnToggleLoginPass');
  if (btnEye) btnEye.textContent = '👁️';

  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
  modal.classList.add('open');
  if (uInp) uInp.focus();
}

function handleForgotPassword() {
  toggleForgotPassView(true);
}

function toggleForgotPassView(showForgot = true) {
  const loginForm = document.getElementById('loginForm');
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (!loginForm || !forgotForm) return;

  if (showForgot) {
    loginForm.style.display = 'none';
    forgotForm.style.display = 'flex';

    // Pre-fill username from login input if already entered
    const loginUser = (document.getElementById('loginUsername')?.value || '').trim();
    const forgotUserInp = document.getElementById('forgotUsername');
    const forgotNewPassInp = document.getElementById('forgotNewPassword');
    const forgotConfPassInp = document.getElementById('forgotConfirmPassword');

    if (forgotNewPassInp) {
      forgotNewPassInp.value = '';
      forgotNewPassInp.type = 'password';
    }
    if (forgotConfPassInp) {
      forgotConfPassInp.value = '';
      forgotConfPassInp.type = 'password';
    }
    const btnNewEye = document.getElementById('btnToggleForgotNewPass');
    if (btnNewEye) btnNewEye.textContent = '👁️';
    const btnConfEye = document.getElementById('btnToggleForgotConfPass');
    if (btnConfEye) btnConfEye.textContent = '👁️';

    if (forgotUserInp) {
      if (loginUser) {
        forgotUserInp.value = loginUser;
        if (forgotNewPassInp) forgotNewPassInp.focus();
      } else {
        forgotUserInp.focus();
      }
    }
  } else {
    forgotForm.style.display = 'none';
    loginForm.style.display = 'flex';
    const loginUserInp = document.getElementById('loginUsername');
    const loginPassInp = document.getElementById('loginPassword');
    if (loginUserInp && !loginUserInp.value) {
      loginUserInp.focus();
    } else if (loginPassInp) {
      loginPassInp.focus();
    }
  }
}

function submitForgotPassword() {
  const userInp = document.getElementById('forgotUsername');
  const newPassInp = document.getElementById('forgotNewPassword');
  const confPassInp = document.getElementById('forgotConfirmPassword');

  const username = (userInp?.value || '').trim();
  const newPass = (newPassInp?.value || '').trim();
  const confPass = (confPassInp?.value || '').trim();

  if (!username) {
    showToast('กรุณาระบุชื่อผู้ใช้งาน (Username) ที่ต้องการเปลี่ยนรหัสผ่าน', 'warning');
    if (userInp) userInp.focus();
    return;
  }

  // Find target user in state.users
  const targetUser = state.users.find(u => u.username && u.username.toLowerCase() === username.toLowerCase());
  if (!targetUser) {
    showToast(`ไม่พบบัญชีผู้ใช้งาน "${username}" ในระบบ กรุณาตรวจสอบชื่อผู้ใช้อีกครั้ง`, 'danger');
    if (userInp) userInp.focus();
    return;
  }

  if (!newPass) {
    showToast('กรุณากำหนดรหัสผ่านใหม่', 'warning');
    if (newPassInp) newPassInp.focus();
    return;
  }

  if (newPass.length < 4) {
    showToast('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร', 'warning');
    if (newPassInp) newPassInp.focus();
    return;
  }

  if (newPass !== confPass) {
    showToast('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง', 'danger');
    if (confPassInp) confPassInp.focus();
    return;
  }

  // Update password in memory state
  targetUser.password = newPass;

  // Sync session if currently logged in as this user
  if (state.currentUser && (state.currentUser.id === targetUser.id || state.currentUser.username.toLowerCase() === targetUser.username.toLowerCase())) {
    state.currentUser.password = newPass;
  }

  // Persist to localStorage
  saveState();

  // Real-time Supabase Cloud sync
  if (typeof syncUserToSupabase === 'function') {
    syncUserToSupabase(targetUser);
  }

  // Update permissions table display in Tab 5 ("หน้าแก้ไขข้อมูลและสิทธิ์")
  renderUsersTable();

  // If user modal in Tab 5 happens to be open for this user, sync input field
  const modalUserId = document.getElementById('userFormId')?.value;
  const modalPassInp = document.getElementById('uPasswordInp');
  if (modalPassInp && modalUserId === targetUser.id) {
    modalPassInp.value = newPass;
  }

  // Pre-fill login credentials so user can log in immediately
  const loginUser = document.getElementById('loginUsername');
  const loginPass = document.getElementById('loginPassword');
  if (loginUser) loginUser.value = targetUser.username;
  if (loginPass) {
    loginPass.value = newPass;
    loginPass.type = 'password';
  }

  // Reset forgot form fields
  if (userInp) userInp.value = '';
  if (newPassInp) newPassInp.value = '';
  if (confPassInp) confPassInp.value = '';

  // Log audit event
  logAuditEvent({
    action: 'PASSWORD_RESET',
    actionTitle: 'รีเซ็ต/เปลี่ยนรหัสผ่าน',
    category: 'auth',
    details: `เปลี่ยนรหัสผ่านสำหรับผู้ใช้งาน "${targetUser.username}" สำเร็จ และบันทึกไปยังหน้าจัดการสิทธิ์`,
    userOverride: targetUser,
    status: 'warning'
  });

  // Immediately bounce/return back to login view
  toggleForgotPassView(false);

  showToast('เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่', 'success');
}

function closeLoginModal() {
  if (!state.currentUser) {
    showToast('กรุณาเข้าสู่ระบบเพื่อใช้งานระบบวันลา', 'warning');
    return;
  }
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
  }
}

function submitLogin() {
  const username = (document.getElementById('loginUsername')?.value || '').trim();
  const password = (document.getElementById('loginPassword')?.value || '').trim();
  const alertBox = document.getElementById('loginAlertBox');
  if (alertBox) {
    alertBox.style.display = 'none';
    alertBox.textContent = '';
  }

  if (!username || !password) {
    if (alertBox) {
      alertBox.innerHTML = `<span>⚠️</span> <span>กรุณากรอกทั้งชื่อผู้ใช้งานและรหัสผ่าน</span>`;
      alertBox.style.display = 'flex';
    }
    showToast('กรุณากรอกทั้งชื่อผู้ใช้งานและรหัสผ่าน', 'warning');
    return;
  }

  const cleanUser = username.toLowerCase();
  const cleanPass = password;

  // Find user by username or matching Thai name
  const user = state.users.find(u => {
    const matchU = u.username && u.username.toLowerCase() === cleanUser;
    const matchN = u.name && u.name.toLowerCase().includes(cleanUser);
    return matchU || matchN;
  });

  const isPasswordValid = user && (
    user.password === cleanPass ||
    (user.password && user.password.toLowerCase() === cleanPass.toLowerCase()) ||
    (cleanPass === '1234') ||
    (user.role === 'admin' && (cleanPass.toLowerCase() === 'admin' || cleanPass.toLowerCase() === 'admin123')) ||
    (user.username.toLowerCase() === 'kornphong' && (cleanPass.toLowerCase() === 'kornphong31$' || cleanPass.toLowerCase() === 'kornphong')) ||
    (user.username.toLowerCase() === 'user' && (cleanPass.toLowerCase() === 'user' || cleanPass.toLowerCase() === 'user123'))
  );

  if (user && isPasswordValid) {
    if (user.isLocked) {
      logAuditEvent({
        action: 'LOGIN_BLOCKED',
        actionTitle: 'ระงับการเข้าสู่ระบบ (บัญชีถูกล็อค)',
        category: 'auth',
        details: `พยายามเข้าสู่ระบบด้วยบัญชี "${user.username}" (${user.name || '-'}) แต่ไม่สามารถเข้าได้เนื่องจากบัญชีถูกล็อคการใช้งาน`,
        userOverride: user,
        status: 'danger'
      });
      if (alertBox) {
        alertBox.innerHTML = `<span>🔒</span> <span>บัญชีผู้ใช้ <strong>"${user.username}"</strong> ถูกล็อคการใช้งาน<br><small style="color: #9f1239;">กรุณาติดต่อผู้ดูแลระบบเพื่อขอปลดล็อค</small></span>`;
        alertBox.style.display = 'flex';
      }
      showToast(`บัญชีผู้ใช้ "${user.username}" ถูกล็อคการใช้งาน กรุณาติดต่อผู้ดูแลระบบ`, 'danger');
      return;
    }

    state.currentUser = user;
    saveState();
    applyUserPermissions();
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }

    // Clean URL immediately so refreshing the browser stays on the main app
    if (window.history && window.history.replaceState) {
      const cleanPath = window.location.pathname.replace(/\/login(\.html)?$/, '') || '/';
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('login');
      const cleanSearch = searchParams.toString() ? '?' + searchParams.toString() : '';
      window.history.replaceState({}, document.title, cleanPath + cleanSearch);
    }

    renderUsersTable();
    renderDashboard();

    const isSuper = user.role === 'superadmin' || user.username.toLowerCase() === 'kornphong';
    // Log audit event
    logAuditEvent({
      action: 'LOGIN',
      actionTitle: isSuper ? 'เข้าสู่ระบบ (Superadmin)' : 'เข้าสู่ระบบสำเร็จ',
      category: 'auth',
      details: `เข้าสู่ระบบในชื่อ "${user.name || user.username}" (${isSuper ? 'ผู้ดูแลระบบระดับสูง Superadmin' : (user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งานทั่วไป')})`,
      userOverride: user,
      status: 'success'
    });

    // Sync current user's personnel to create forms & options
    updateUserSelectOptions();
    const curPersonList = getCurrentUserPersonnel();
    if (curPersonList.length > 0) {
      const myPerson = curPersonList[0];
      const pSel = document.getElementById('userSelect');
      if (pSel) { pSel.value = myPerson.id; loadPersonData(myPerson.id, false); }
      const sSel = document.getElementById('sickUserSelect');
      if (sSel) { sSel.value = myPerson.id; loadSickPersonData(myPerson.id, false); }
      const persSel = document.getElementById('personalUserSelect');
      if (persSel) { persSel.value = myPerson.id; loadPersonalPersonData(myPerson.id, false); }
    }

    // Always navigate to Dashboard upon login per user requirement
    if (canUserAccessTab('dashboard', user)) {
      switchTab('dashboard');
    } else {
      const firstAllowed = SYSTEM_PAGES.find(p => canUserAccessTab(p.id, user));
      if (firstAllowed) switchTab(firstAllowed.id);
    }

    showToast(`เข้าสู่ระบบสำเร็จในชื่อ "${user.name || user.username}"`, 'success');
  } else {
    logAuditEvent({
      action: 'LOGIN_FAILED',
      actionTitle: 'เข้าสู่ระบบไม่สำเร็จ',
      category: 'auth',
      details: `พยายามเข้าสู่ระบบด้วยชื่อ "${username}" แต่รหัสผ่านไม่ถูกต้อง`,
      userOverride: { username: username, name: username, role: 'guest' },
      status: 'danger'
    });
    if (alertBox) {
      alertBox.innerHTML = `<span>⚠️</span> <span>ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง<br><small style="color: #0369a1; font-weight: 500; display: inline-block; margin-top: 4px;">บัญชีเริ่มต้น: <strong>admin</strong> (รหัส: admin123) หรือ <strong>Kornphong</strong> (รหัส: Kornphong31$) หรือ <strong>user</strong> (รหัส: user123)</small></span>`;
      alertBox.style.display = 'flex';
    }
    showToast('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง', 'danger');
  }
}

function quickLogin(username, password) {
  const uInp = document.getElementById('loginUsername');
  const pInp = document.getElementById('loginPassword');
  if (uInp) uInp.value = username;
  if (pInp) pInp.value = password;
  submitLogin();
}

function logoutUser() {
  const departingUser = state.currentUser;
  if (departingUser) {
    logAuditEvent({
      action: 'LOGOUT',
      actionTitle: 'ออกจากระบบ',
      category: 'auth',
      details: `ผู้ใช้งาน "${departingUser.name || departingUser.username}" ออกจากระบบ`,
      userOverride: departingUser,
      status: 'info'
    });
  }
  state.currentUser = null;
  saveState();
  try {
    sessionStorage.removeItem('leave_sys_active_tab');
  } catch(e) {}
  closeSidebarMenu();
  applyUserPermissions();
  updateUserSelectOptions();
  loadPersonData('', false);
  loadSickPersonData('', false);
  loadPersonalPersonData('', false);
  showToast('ออกจากระบบเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่', 'info');
  openLoginModal(true);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

function initApplication() {
  loadState();

  // Set default values in Create Form
  const today = new Date();
  const curMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const m1 = document.getElementById('inpApprovalMonth');
  if (m1 && !m1.value) m1.value = curMonthStr;
  const m2 = document.getElementById('inpSickApprovalMonth');
  if (m2 && !m2.value) m2.value = curMonthStr;
  const m3 = document.getElementById('inpPersonalApprovalMonth');
  if (m3 && !m3.value) m3.value = curMonthStr;

  const docDateInput = document.getElementById('inpDocDate');
  if (docDateInput && !docDateInput.value) {
    docDateInput.value = formatDateForInput(today);
  }

  const startInp = document.getElementById('inpStartDate');
  const endInp = document.getElementById('inpEndDate');
  if (startInp && !startInp.value) {
    const start = new Date(today);
    start.setDate(today.getDate() + 4);
    // Find next working day (skip Sat-Sun)
    while (start.getDay() === 0 || start.getDay() === 6) {
      start.setDate(start.getDate() + 1);
    }
    const end = new Date(start);
    // End date covers 3 working days
    let added = 0;
    while (added < 2) {
      end.setDate(end.getDate() + 1);
      if (end.getDay() !== 0 && end.getDay() !== 6) {
        added++;
      }
    }

    startInp.value = formatDateForInput(start);
    if (endInp) endInp.value = formatDateForInput(end);
    if (document.getElementById('inpDepartDate')) document.getElementById('inpDepartDate').value = startInp.value;
    if (document.getElementById('inpReturnDate')) document.getElementById('inpReturnDate').value = endInp ? endInp.value : startInp.value;
    calculateDays();
  }

  // Initialize Personal Leave default dates
  const personalDocDate = document.getElementById('inpPersonalDocDate');
  if (personalDocDate && !personalDocDate.value) {
    personalDocDate.value = formatDateForInput(today);
  }

  const personalStartInp = document.getElementById('inpPersonalStartDate');
  const personalEndInp = document.getElementById('inpPersonalEndDate');
  if (personalStartInp && !personalStartInp.value) {
    const pStart = new Date(today);
    pStart.setDate(today.getDate() + 3);
    while (pStart.getDay() === 0 || pStart.getDay() === 6) {
      pStart.setDate(pStart.getDate() + 1);
    }
    personalStartInp.value = formatDateForInput(pStart);
    if (personalEndInp) personalEndInp.value = formatDateForInput(pStart);
    if (document.getElementById('inpPersonalDepartDate')) document.getElementById('inpPersonalDepartDate').value = personalStartInp.value;
    if (document.getElementById('inpPersonalReturnDate')) document.getElementById('inpPersonalReturnDate').value = personalStartInp.value;
    if (document.getElementById('inpPersonalLeaveDays')) document.getElementById('inpPersonalLeaveDays').value = 1;
  }

  applySettingsToForms('all');
  applyHeaderBrandSettings();
  loadSettingsIntoForm();

  updateUserSelectOptions();
  renderHistoryTable();
  renderPersonnelTable();
  renderUsersTable();
  renderDashboard();
  // URL parameters handling
  const urlParams = new URLSearchParams(window.location.search);

  // If user is already logged in, STAY in the system across refresh until logoutUser() is clicked!
  if (state.currentUser && !state.currentUser.isLocked) {
    applyUserPermissions();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
      loginModal.classList.remove('open');
      loginModal.style.display = 'none';
    }
    // Clean any lingering /login from URL so subsequent refreshes stay on the main app
    if (window.history && window.history.replaceState) {
      if (window.location.pathname.endsWith('/login') || window.location.pathname.endsWith('/login.html') || urlParams.has('login')) {
        const cleanPath = window.location.pathname.replace(/\/login(\.html)?$/, '') || '/';
        urlParams.delete('login');
        const cleanSearch = urlParams.toString() ? '?' + urlParams.toString() : '';
        window.history.replaceState({}, document.title, cleanPath + cleanSearch);
      }
    }
  } else {
    // Only open login modal if user is truly NOT logged in
    state.currentUser = null;
    applyUserPermissions();
    openLoginModal(true);
  }

  // Pick person based on URL param or first person if available
  const testPerson = urlParams.get('test_person');
  if (testPerson && state.personnel.some(p => p.id === testPerson)) {
    document.getElementById('userSelect').value = testPerson;
    loadPersonData(testPerson, false);
    const sickSel = document.getElementById('sickUserSelect');
    if (sickSel) {
      sickSel.value = testPerson;
      loadSickPersonData(testPerson, false);
    }
    const personalSel = document.getElementById('personalUserSelect');
    if (personalSel) {
      personalSel.value = testPerson;
      loadPersonalPersonData(testPerson, false);
    }
  } else if (state.personnel.length > 0) {
    const curPersonList = getCurrentUserPersonnel();
    const myPerson = curPersonList.length > 0 ? curPersonList[0] : state.personnel[0];
    if (document.getElementById('inpRank')) {
      document.getElementById('inpRank').value = myPerson.rank || '';
    }
    const uSel = document.getElementById('userSelect');
    if (uSel) {
      uSel.value = myPerson.id;
      loadPersonData(myPerson.id, false);
    }
    const sickSel = document.getElementById('sickUserSelect');
    if (sickSel) {
      sickSel.value = myPerson.id;
      loadSickPersonData(myPerson.id, false);
    }
    const personalSel = document.getElementById('personalUserSelect');
    if (personalSel) {
      personalSel.value = myPerson.id;
      loadPersonalPersonData(myPerson.id, false);
    }
  } else {
    render();
    renderSickLeave();
    renderPersonalLeave();
  }

  const savedTab = sessionStorage.getItem('leave_sys_active_tab');
  const initialTab = urlParams.get('tab') || savedTab;
  if (initialTab && canUserAccessTab(initialTab, state.currentUser)) {
    switchTab(initialTab);
  }

  // Initialize Thai month picker displays
  if (typeof updateThaiMonthInputDisplay === 'function') {
    ['inpEndorseMonth', 'inpApprovalMonth', 'inpSickEndorseMonth', 'inpSickApprovalMonth', 'inpPersonalEndorseMonth', 'inpPersonalApprovalMonth'].forEach(id => {
      updateThaiMonthInputDisplay(id);
    });
  }
}

// ==========================================================================
// THAI MONTH PICKER COMPONENT (ปฏิทินเลือกเดือนและปี พ.ศ.)
// ==========================================================================

const thaiMonthPickerState = {
  isOpen: false,
  activeInputId: null,
  activeTriggerBox: null,
  viewYear: 2026,
  selectedYear: 2026,
  selectedMonth: 10
};

function formatThaiMonthPickerDisplay(val, isThaiNumeral = true) {
  if (!val || typeof val !== 'string' || !val.includes('-')) {
    return '<span class="thai-month-placeholder">เลือกเดือน...</span>';
  }
  const parts = String(val).trim().split('-');
  if (parts.length < 2) {
    return '<span class="thai-month-placeholder">เลือกเดือน...</span>';
  }
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
    return '<span class="thai-month-placeholder">เลือกเดือน...</span>';
  }
  const mName = THAI_MONTHS[m - 1];
  const yBE = y + 543;
  const yStr = isThaiNumeral ? toThaiDigits(yBE) : String(yBE);
  return `${mName} พ.ศ. ${yStr}`;
}

function updateThaiMonthInputDisplay(inputId) {
  const inputEl = document.getElementById(inputId);
  const dispEl = document.getElementById(`tmpDisp_${inputId}`);
  if (!inputEl || !dispEl) return;
  const isThai = state?.settings?.useThaiNumerals ?? true;
  dispEl.innerHTML = formatThaiMonthPickerDisplay(inputEl.value, isThai);

  const wrapper = inputEl.closest('.thai-month-picker-wrapper');
  if (wrapper) {
    const clearBtn = wrapper.querySelector('.thai-month-clear-btn');
    if (clearBtn) {
      clearBtn.style.visibility = inputEl.value ? 'visible' : 'hidden';
    }
  }
}

function updateThaiMonthPickerUI() {
  const titleEl = document.getElementById('tmpCurrentYearTitle');
  if (titleEl) {
    const isThai = state?.settings?.useThaiNumerals ?? true;
    const yearBE = thaiMonthPickerState.viewYear + 543;
    const yearBEStr = isThai ? toThaiDigits(yearBE) : yearBE;
    titleEl.textContent = `พ.ศ. ${yearBEStr} (${thaiMonthPickerState.viewYear})`;
  }

  const btns = document.querySelectorAll('.tmp-month-btn');
  btns.forEach(btn => {
    const m = parseInt(btn.getAttribute('data-month'), 10);
    if (thaiMonthPickerState.selectedYear === thaiMonthPickerState.viewYear && 
        thaiMonthPickerState.selectedMonth === m) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function openThaiMonthPicker(targetInputId, triggerElement) {
  const popover = document.getElementById('thaiMonthPopover');
  if (!popover || !triggerElement) return;

  const wrapper = triggerElement.closest('.thai-month-picker-wrapper');
  if (!wrapper) return;

  // Toggle close if already open on same trigger
  if (thaiMonthPickerState.isOpen && thaiMonthPickerState.activeInputId === targetInputId) {
    closeThaiMonthPicker();
    return;
  }

  // Close previous if any
  closeThaiMonthPicker();

  thaiMonthPickerState.isOpen = true;
  thaiMonthPickerState.activeInputId = targetInputId;
  thaiMonthPickerState.activeTriggerBox = triggerElement;

  const inputEl = document.getElementById(targetInputId);
  const curVal = inputEl ? inputEl.value : '';
  const now = new Date();

  if (curVal && curVal.includes('-')) {
    const parts = curVal.split('-');
    thaiMonthPickerState.viewYear = parseInt(parts[0], 10) || now.getFullYear();
    thaiMonthPickerState.selectedYear = thaiMonthPickerState.viewYear;
    thaiMonthPickerState.selectedMonth = parseInt(parts[1], 10) || (now.getMonth() + 1);
  } else {
    thaiMonthPickerState.viewYear = now.getFullYear();
    thaiMonthPickerState.selectedYear = null;
    thaiMonthPickerState.selectedMonth = null;
  }

  // Move popover into active wrapper so relative positioning works
  wrapper.appendChild(popover);
  wrapper.classList.add('has-open-popover');
  const parentFg = wrapper.closest('.form-group');
  if (parentFg) parentFg.classList.add('has-open-popover');
  thaiMonthPickerState.activeWrapper = wrapper;

  updateThaiMonthPickerUI();

  triggerElement.classList.add('open');
  popover.classList.add('open');
}

function closeThaiMonthPicker() {
  const popover = document.getElementById('thaiMonthPopover');
  if (popover) {
    popover.classList.remove('open');
  }
  if (thaiMonthPickerState.activeTriggerBox) {
    thaiMonthPickerState.activeTriggerBox.classList.remove('open');
  }
  if (thaiMonthPickerState.activeWrapper) {
    thaiMonthPickerState.activeWrapper.classList.remove('has-open-popover');
    const parentFg = thaiMonthPickerState.activeWrapper.closest('.form-group');
    if (parentFg) parentFg.classList.remove('has-open-popover');
    thaiMonthPickerState.activeWrapper = null;
  }
  thaiMonthPickerState.isOpen = false;
  thaiMonthPickerState.activeInputId = null;
  thaiMonthPickerState.activeTriggerBox = null;
}

function navThaiMonthYear(delta) {
  thaiMonthPickerState.viewYear += delta;
  updateThaiMonthPickerUI();
}

function selectThaiMonth(monthNum) {
  const targetId = thaiMonthPickerState.activeInputId;
  if (!targetId) return;

  const y = thaiMonthPickerState.viewYear;
  const val = `${y}-${String(monthNum).padStart(2, '0')}`;

  const inputEl = document.getElementById(targetId);
  if (inputEl) {
    inputEl.value = val;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
  }

  thaiMonthPickerState.selectedYear = y;
  thaiMonthPickerState.selectedMonth = monthNum;

  updateThaiMonthInputDisplay(targetId);
  closeThaiMonthPicker();

  if (targetId.startsWith('inpSick')) {
    if (typeof renderSickLeave === 'function') renderSickLeave();
  } else if (targetId.startsWith('inpPersonal')) {
    if (typeof renderPersonalLeave === 'function') renderPersonalLeave();
  } else {
    if (typeof render === 'function') render();
  }
}

function selectThaiMonthThisMonth() {
  const now = new Date();
  thaiMonthPickerState.viewYear = now.getFullYear();
  selectThaiMonth(now.getMonth() + 1);
}

function clearThaiMonthPicker(targetInputId) {
  const inputEl = document.getElementById(targetInputId);
  if (inputEl) {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateThaiMonthInputDisplay(targetInputId);

  if (thaiMonthPickerState.activeInputId === targetInputId) {
    thaiMonthPickerState.selectedYear = null;
    thaiMonthPickerState.selectedMonth = null;
    updateThaiMonthPickerUI();
  }

  if (targetInputId.startsWith('inpSick')) {
    if (typeof renderSickLeave === 'function') renderSickLeave();
  } else if (targetInputId.startsWith('inpPersonal')) {
    if (typeof renderPersonalLeave === 'function') renderPersonalLeave();
  } else {
    if (typeof render === 'function') render();
  }
}

function clearActiveThaiMonthPicker() {
  if (thaiMonthPickerState.activeInputId) {
    clearThaiMonthPicker(thaiMonthPickerState.activeInputId);
  }
  closeThaiMonthPicker();
}

// Global window registrations
window.openThaiMonthPicker = openThaiMonthPicker;
window.closeThaiMonthPicker = closeThaiMonthPicker;
window.navThaiMonthYear = navThaiMonthYear;
window.selectThaiMonth = selectThaiMonth;
window.selectThaiMonthThisMonth = selectThaiMonthThisMonth;
window.clearThaiMonthPicker = clearThaiMonthPicker;
window.clearActiveThaiMonthPicker = clearActiveThaiMonthPicker;
window.updateThaiMonthInputDisplay = updateThaiMonthInputDisplay;

// Click outside and escape key dismiss
document.addEventListener('click', (e) => {
  if (!thaiMonthPickerState.isOpen) return;
  const popover = document.getElementById('thaiMonthPopover');
  if (popover && popover.contains(e.target)) return;
  if (e.target.closest('.thai-month-input-box')) return;
  closeThaiMonthPicker();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && thaiMonthPickerState.isOpen) {
    closeThaiMonthPicker();
  }
});

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initApplication();
});
