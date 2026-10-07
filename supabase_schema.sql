-- =============================================================================
-- ระบบสารสนเทศบริหารจัดการการลาอิเล็กทรอนิกส์ (RTAF Leave Management System)
-- SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- คัดลอกคำสั่งทั้งหมดนี้ไปวางในเมนู SQL Editor ใน Supabase Dashboard แล้วกด Run
-- =============================================================================

-- เปิด Extension UUID สำหรับสร้าง Primary Key อัตโนมัติ (ถ้าจำเป็น)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. ตารางการตั้งค่าระบบ (SYSTEM SETTINGS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    system_title TEXT NOT NULL DEFAULT 'ระบบสารสนเทศบริหารจัดการการลาอิเล็กทรอนิกส์',
    system_subtitle TEXT NOT NULL DEFAULT 'งานสารบรรณและทะเบียนกำลังพล • ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    system_logo TEXT DEFAULT '📋',
    unit_name TEXT DEFAULT 'โรงเรียนจ่าอากาศ กรมยุทธศึกษาทหารอากาศ',
    sub_org_name TEXT DEFAULT 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    written_at TEXT DEFAULT 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    default_to TEXT DEFAULT 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    endorse_to TEXT DEFAULT 'หก.กกศ.รร.จอ.ยศ.ทอ.',
    endorse_rank TEXT DEFAULT 'น.ท.',
    endorse_pos TEXT DEFAULT 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    endorse_pos2 TEXT DEFAULT '',
    order_rank TEXT DEFAULT 'น.ท.',
    order_pos1 TEXT DEFAULT 'รอง หก.กกศ.รร.จอ.ยศ.ทอ.ทำการแทน',
    order_pos2 TEXT DEFAULT 'หก.กกศ.รร.จอ.ยศ.ทอ.',
    stat_sign_name TEXT DEFAULT 'พ.อ.อ.หญิง สุมาลี  มีสุข',
    stat_sign_pos TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. ตารางทะเบียนกำลังพล (PERSONNEL REGISTRY)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.personnel (
    id TEXT PRIMARY KEY,
    rank TEXT NOT NULL,
    name TEXT NOT NULL,
    position TEXT,
    position2 TEXT,
    unit TEXT,
    annual_quota INTEGER DEFAULT 10,
    acc_quota INTEGER DEFAULT 0,
    sick_quota INTEGER DEFAULT 60,
    sick_taken INTEGER DEFAULT 0,
    home_no TEXT,
    road TEXT,
    subdistrict TEXT,
    district TEXT,
    province TEXT DEFAULT 'กรุงเทพมหานคร',
    phone TEXT,
    pronoun TEXT DEFAULT 'กระผม',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personnel_name ON public.personnel(name);
CREATE INDEX IF NOT EXISTS idx_personnel_rank ON public.personnel(rank);

-- =============================================================================
-- 3. ตารางผู้ใช้งานและสิทธิ์ (APP USERS & PERMISSIONS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'superadmin', 'admin', 'user'
    person_id TEXT REFERENCES public.personnel(id) ON DELETE SET NULL,
    allowed_pages JSONB DEFAULT '["dashboard", "create", "create-sick", "create-personal", "history"]'::jsonb,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_users_username ON public.app_users(username);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON public.app_users(role);

-- =============================================================================
-- 4. ตารางทะเบียนคุมใบลา (LEAVE RECORDS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.leaves (
    id TEXT PRIMARY KEY,
    person_id TEXT REFERENCES public.personnel(id) ON DELETE SET NULL,
    username TEXT NOT NULL,
    created_by TEXT NOT NULL,
    name TEXT NOT NULL,
    position TEXT,
    leave_type TEXT NOT NULL, -- 'vacation', 'sick', 'personal'
    form_type TEXT NOT NULL,  -- 'ลาพักผ่อน (แบบ ๗)', 'ลาป่วย (แบบ ๓)', 'ลากิจธุระ (แบบ ๖)'
    doc_date DATE,
    start_date DATE,
    end_date DATE,
    days INTEGER DEFAULT 1,
    province TEXT DEFAULT 'กรุงเทพมหานคร',
    contact_address TEXT,
    phone TEXT,
    diagnosis TEXT,           -- สำหรับลาป่วย (แบบ ๓)
    hospital TEXT,            -- สำหรับลาป่วย (แบบ ๓)
    reason TEXT,              -- สำหรับลากิจธุระ (แบบ ๖)
    status TEXT DEFAULT 'pending', -- 'approved', 'pending', 'rejected'
    discrete_dates JSONB,     -- สำหรับวันลาแบบกระจายวัน
    custom_date_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaves_username ON public.leaves(username);
CREATE INDEX IF NOT EXISTS idx_leaves_person_id ON public.leaves(person_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON public.leaves(status);
CREATE INDEX IF NOT EXISTS idx_leaves_leave_type ON public.leaves(leave_type);
CREATE INDEX IF NOT EXISTS idx_leaves_doc_date ON public.leaves(doc_date);

-- =============================================================================
-- 5. ตารางบันทึกประวัติการใช้งาน (AUDIT LOGS)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    username TEXT NOT NULL,
    user_name TEXT,
    role TEXT DEFAULT 'user',
    action TEXT NOT NULL,
    action_title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    details TEXT,
    ip TEXT DEFAULT '127.0.0.1 (Localhost)',
    status TEXT DEFAULT 'info', -- 'success', 'info', 'warning', 'danger'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_username ON public.audit_logs(username);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- อนุญาตให้อ่านและเขียนผ่าน Anon Key สำหรับ Web Application
-- =============================================================================
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- นโยบายเปิดให้ Anon เข้าถึงได้ (สำหรับ Client App)
DROP POLICY IF EXISTS "Allow anon all on system_settings" ON public.system_settings;
CREATE POLICY "Allow anon all on system_settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on personnel" ON public.personnel;
CREATE POLICY "Allow anon all on personnel" ON public.personnel FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on app_users" ON public.app_users;
CREATE POLICY "Allow anon all on app_users" ON public.app_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on leaves" ON public.leaves;
CREATE POLICY "Allow anon all on leaves" ON public.leaves FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow anon all on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- 6. ข้อมูลเริ่มต้น (INITIAL SEED DATA)
-- =============================================================================

-- ข้อมูลตั้งค่าระบบ
INSERT INTO public.system_settings (id, system_title, system_subtitle, unit_name, sub_org_name, written_at, default_to, endorse_to, endorse_rank, endorse_pos, endorse_pos2, order_rank, order_pos1, order_pos2, stat_sign_name)
VALUES (
    'default',
    'ระบบสารสนเทศบริหารจัดการการลาอิเล็กทรอนิกส์',
    'งานสารบรรณและทะเบียนกำลังพล • ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    'โรงเรียนจ่าอากาศ กรมยุทธศึกษาทหารอากาศ',
    'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    'ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    'หก.กกศ.รร.จอ.ยศ.ทอ.',
    'น.ท.',
    'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.',
    '',
    'น.ท.',
    'รอง หก.กกศ.รร.จอ.ยศ.ทอ.ทำการแทน',
    'หก.กกศ.รร.จอ.ยศ.ทอ.',
    'พ.อ.อ.หญิง สุมาลี  มีสุข'
)
ON CONFLICT (id) DO UPDATE SET
    system_title = EXCLUDED.system_title,
    system_subtitle = EXCLUDED.system_subtitle;

-- ข้อมูลกำลังพลเริ่มต้น
INSERT INTO public.personnel (id, rank, name, position, position2, unit, annual_quota, acc_quota, sick_quota, sick_taken, home_no, road, subdistrict, district, province, phone, pronoun)
VALUES
('p0', 'พ.อ.อ.', 'กรณ์พงษ์  สุขเกียรติ์สกุล', 'ผู้ดูแลระบบและพัฒนาระบบสารบรรณอิเล็กทรอนิกส์', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 10, 60, 0, '171/42', 'พหลโยธิน', 'คลองถนน', 'สายไหม', 'กรุงเทพมหานคร', '081-234-5678', 'กระผม'),
('p1', 'ร.ท.', 'สมชาย  ใจดี', 'ประจำ ผวสม.กกศ.ฯ', '', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 5, 60, 0, '12/3', 'พหลโยธิน', 'คลองถนน', 'สายไหม', 'กรุงเทพมหานคร', '081-234-5678', 'กระผม'),
('p2', 'พ.อ.อ.', 'เกรียงไกร  มีชัย', 'จนท.การศึกษา ผวสม.กกศ.ฯ', '', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 10, 60, 0, '55/9', 'วิภาวดีรังสิต', 'สนามบิน', 'ดอนเมือง', 'กรุงเทพมหานคร', '086-555-1234', 'กระผม'),
('p3', 'จ.อ.หญิง', 'นภาพร  สว่างจิต', 'จนท.ธุรการ ผวสม.กกศ.ฯ', '', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 0, 60, 0, '88/1', 'แจ้งวัฒนะ', 'ทุ่งสองห้อง', 'หลักสี่', 'กรุงเทพมหานคร', '084-333-7890', 'ดิฉัน'),
('p4', 'ร.อ.', 'วิโรจน์  แดนไทย', 'ผช.หน.ผวสม.กกศ.ฯ', '', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 15, 60, 0, '102/4', 'รามอินทรา', 'อนุสาวรีย์', 'บางเขน', 'กรุงเทพมหานคร', '089-111-2233', 'กระผม'),
('p5', 'น.ท.หญิง', 'ปุณยวีย์  สุขวิบูลย์', 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.', '', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 10, 60, 0, '99/5', 'พหลโยธิน', 'คลองถนน', 'สายไหม', 'กรุงเทพมหานคร', '081-999-8877', 'ดิฉัน'),
('p6', 'พ.อ.อ.', 'วิทยา  อุ่นโรจน์', 'ครูผู้ช่วย ผวสส.กกศ.รร.จอ.ยศ.ทอ.', 'ช่วยราชการ ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 'ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 10, 0, 60, 0, '12/3', 'พหลโยธิน', 'คลองถนน', 'สายไหม', 'กรุงเทพมหานคร', '081-234-5678', 'กระผม')
ON CONFLICT (id) DO UPDATE SET
    rank = EXCLUDED.rank,
    name = EXCLUDED.name,
    position = EXCLUDED.position;

-- ข้อมูลผู้ใช้งานเริ่มต้น (พร้อมรหัสผ่านที่ผู้ใช้กำหนด)
INSERT INTO public.app_users (id, username, password, name, role, person_id, allowed_pages, is_locked)
VALUES
('u0', 'Kornphong', 'Kornphong31$', 'พ.อ.อ.กรณ์พงษ์  สุขเกียรติ์สกุล', 'superadmin', 'p0', '["dashboard", "create", "create-sick", "create-personal", "history", "personnel", "settings", "permissions", "audit-log"]'::jsonb, false),
('u1', 'admin', 'admin123', 'ผู้ดูแลระบบ (Admin)', 'admin', NULL, '["dashboard", "create", "create-sick", "create-personal", "history", "personnel", "settings", "permissions", "audit-log"]'::jsonb, false),
('u2', 'user', 'user123', 'ร.ท.สมชาย  ใจดี', 'user', 'p1', '["dashboard", "create", "create-sick", "create-personal", "history"]'::jsonb, false),
('u3', 'user2', 'user123', 'พ.อ.อ.เกรียงไกร  มีชัย', 'user', 'p2', '["dashboard", "create", "create-sick", "create-personal", "history"]'::jsonb, false)
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role;

-- ข้อมูลใบลาเริ่มต้น
INSERT INTO public.leaves (id, person_id, username, created_by, name, position, leave_type, form_type, doc_date, start_date, end_date, days, province, contact_address, phone, diagnosis, hospital, reason, status)
VALUES
('LV-2569-001', 'p1', 'user', 'user', 'ร.ท.สมชาย  ใจดี', 'ประจำ ผวสม.กกศ.ฯ', 'vacation', 'ลาพักผ่อน (แบบ ๗)', '2026-06-10', '2026-06-15', '2026-06-17', 3, 'ระยอง', 'บ้านพักเลขที่ 12/3 ถ.สุขุมวิท อ.เมือง จ.ระยอง', '081-234-5678', NULL, NULL, NULL, 'approved'),
('SK-2569-001', 'p2', 'user2', 'user2', 'พ.อ.อ.เกรียงไกร  มีชัย', 'จนท.การศึกษา ผวสม.กกศ.ฯ', 'sick', 'ลาป่วย (แบบ ๓)', '2026-06-20', '2026-06-22', '2026-06-23', 2, 'กรุงเทพมหานคร', '55/9 ถ.วิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กทม.', '086-555-1234', 'ไข้หวัดใหญ่ พักรักษาตัวตามแพทย์สั่ง', 'รพ.ภูมิพลอดุลยเดช พอ.', NULL, 'approved'),
('PERS-2569-001', 'p3', 'user3', 'user3', 'จ.อ.หญิง นภาพร  สว่างจิต', 'จนท.ธุรการ ผวสม.กกศ.ฯ', 'personal', 'ลากิจธุระ (แบบ ๖)', '2026-06-28', '2026-07-01', '2026-07-02', 2, 'เชียงใหม่', '88/1 ถ.แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กทม.', '084-333-7890', NULL, NULL, 'ติดต่อราชการทำนิติกรรมที่ดินภูมิลำเนาเดิม', 'approved'),
('LV-2569-002', 'p4', 'user4', 'user4', 'ร.อ.วิโรจน์  แดนไทย', 'ผช.หน.ผวสม.กกศ.ฯ', 'vacation', 'ลาพักผ่อน (แบบ ๗)', '2026-08-05', '2026-08-10', '2026-08-14', 5, 'ชลบุรี', '102/4 ถ.รามอินทรา แขวงอนุสาวรีย์ เขตบางเขน กทม.', '089-111-2233', NULL, NULL, NULL, 'approved'),
('LV-2569-003', 'p5', 'user5', 'user5', 'น.ท.หญิง ปุณยวีย์  สุขวิบูลย์', 'หน.ผวสม.กกศ.รร.จอ.ยศ.ทอ.', 'vacation', 'ลาพักผ่อน (แบบ ๗)', '2026-09-01', '2026-09-02', '2026-09-04', 3, 'เชียงใหม่', '99/5 ถ.พหลโยธิน แขวงคลองถนน เขตสายไหม กทม.', '081-999-8877', NULL, NULL, NULL, 'pending')
ON CONFLICT (id) DO NOTHING;

-- บันทึกประวัติกิจกรรมเริ่มต้น
INSERT INTO public.audit_logs (id, timestamp, username, user_name, role, action, action_title, category, details, ip, status)
VALUES
('LOG-INITIAL-01', NOW(), 'Kornphong', 'พ.อ.อ.กรณ์พงษ์  สุขเกียรติ์สกุล', 'superadmin', 'SYSTEM_INIT', 'เริ่มต้นติดตั้งฐานข้อมูลระบบ', 'system', 'ติดตั้งโครงสร้างฐานข้อมูลและค่าเริ่มต้นระบบวันลาบน Supabase', '127.0.0.1 (Localhost)', 'success')
ON CONFLICT (id) DO NOTHING;
