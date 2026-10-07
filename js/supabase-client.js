/**
 * =============================================================================
 * SUPABASE CLOUD DATABASE CLIENT MODULE
 * จัดการการเชื่อมต่อและซิงค์ข้อมูลระหว่าง Web Application กับ Supabase
 * =============================================================================
 */

let supabaseClient = null;

function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem('rtaf_supabase_config');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Supabase config:', e);
  }
  return { url: '', key: '', autoSync: false };
}

function formatSupabaseUrl(rawUrl) {
  let url = (rawUrl || '').trim();
  if (!url) return '';
  // Check if user accidentally pasted dashboard URL (e.g. https://supabase.com/dashboard/project/xyz...)
  const dashMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashMatch) {
    url = `https://${dashMatch[1]}.supabase.co`;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  return url;
}

function saveSupabaseConfig(url, key, autoSync = true) {
  const cleanUrl = formatSupabaseUrl(url);
  const cfg = {
    url: cleanUrl,
    key: (key || '').trim(),
    autoSync: !!autoSync
  };
  localStorage.setItem('rtaf_supabase_config', JSON.stringify(cfg));
  initSupabaseClient();
  return cfg;
}

function isSupabaseConfigured() {
  const cfg = getSupabaseConfig();
  return !!(cfg.url && cfg.key && typeof supabase !== 'undefined' && supabase.createClient);
}

function initSupabaseClient() {
  const cfg = getSupabaseConfig();
  if (cfg.url && cfg.key && typeof supabase !== 'undefined' && supabase.createClient) {
    try {
      supabaseClient = supabase.createClient(cfg.url, cfg.key);
      console.log('⚡ Supabase Client initialized successfully');
      return true;
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
      supabaseClient = null;
      return false;
    }
  }
  supabaseClient = null;
  return false;
}

/**
 * ทดสอบการเชื่อมต่อไปยัง Supabase
 */
async function testSupabaseConnection(customUrl = null, customKey = null) {
  const cfg = getSupabaseConfig();
  let url = formatSupabaseUrl(customUrl || cfg.url);
  const key = (customKey || cfg.key || '').trim();

  if (!url || !key) {
    return { success: false, message: 'กรุณากรอกทั้ง Project URL และ Anon Key ให้ครบถ้วน' };
  }

  if (typeof supabase === 'undefined' || !supabase.createClient) {
    return { success: false, message: 'ไม่พบไลบรารี Supabase JS (กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต)' };
  }

  try {
    const client = supabase.createClient(url, key);
    const { data, error } = await client.from('system_settings').select('*').limit(1);
    if (error) {
      // กรณีเชื่อมต่อไปยัง Supabase สำเร็จ แต่ยังไม่ได้กดรันคำสั่ง SQL สร้างตาราง
      const errMsg = (error.message || '').toLowerCase();
      if (errMsg.includes('relation "public.system_settings" does not exist') || errMsg.includes('does not exist')) {
        return {
          success: true,
          tablePending: true,
          formattedUrl: url,
          message: 'เชื่อมต่อ Supabase ได้แล้ว! 🟢 แต่ยังไม่พบตารางในฐานข้อมูล (อย่าลืมเปิด SQL Editor แล้วกด Run ไฟล์ supabase_schema.sql นะครับ)'
        };
      }
      return { success: false, formattedUrl: url, message: `การเชื่อมต่อผิดพลาด: ${error.message}` };
    }
    return { success: true, formattedUrl: url, message: 'เชื่อมต่อฐานข้อมูล Supabase สำเร็จเรียบร้อย! 🟢' };
  } catch (e) {
    return { success: false, formattedUrl: url, message: `เกิดข้อผิดพลาดในการเชื่อมต่อ: ${e.message}` };
  }
}

/**
 * ดึงข้อมูลทั้งหมดจาก Supabase ลงสู่ state ในเครื่อง
 */
async function pullFromSupabase() {
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient) {
    return { success: false, message: 'Supabase ยังไม่ได้ตั้งค่าหรือเชื่อมต่อ' };
  }

  try {
    // 1. Settings
    const { data: settingsData } = await supabaseClient.from('system_settings').select('*').limit(1);
    if (settingsData && settingsData.length > 0) {
      const s = settingsData[0];
      state.settings = {
        ...state.settings,
        systemTitle: s.system_title || state.settings.systemTitle,
        systemSubtitle: s.system_subtitle || state.settings.systemSubtitle,
        systemLogo: s.system_logo || state.settings.systemLogo,
        unitName: s.unit_name || state.settings.unitName,
        subOrgName: s.sub_org_name || state.settings.subOrgName,
        writtenAt: s.written_at || state.settings.writtenAt,
        defaultTo: s.default_to || state.settings.defaultTo,
        endorseTo: s.endorse_to || state.settings.endorseTo,
        endorseRank: s.endorse_rank || state.settings.endorseRank,
        endorsePos: s.endorse_pos || state.settings.endorsePos,
        endorsePos2: s.endorse_pos2 !== undefined ? (s.endorse_pos2 || '') : (state.settings.endorsePos2 || ''),
        orderRank: s.order_rank || state.settings.orderRank,
        orderPos1: s.order_pos1 || state.settings.orderPos1,
        orderPos2: s.order_pos2 || state.settings.orderPos2,
        statSignName: s.stat_sign_name || state.settings.statSignName,
        statSignPos: s.stat_sign_pos || state.settings.statSignPos
      };
    }

    // 2. Personnel
    const { data: personnelData, error: pErr } = await supabaseClient.from('personnel').select('*').order('created_at', { ascending: true });
    if (!pErr && personnelData && personnelData.length > 0) {
      state.personnel = personnelData.map(p => ({
        id: p.id,
        rank: p.rank,
        name: p.name,
        position: p.position || '',
        position2: p.position2 || '',
        unit: p.unit || '',
        annualQuota: p.annual_quota ?? 10,
        accQuota: p.acc_quota ?? 0,
        sickQuota: p.sick_quota ?? 60,
        sickTaken: p.sick_taken ?? 0,
        homeNo: p.home_no || '',
        road: p.road || '',
        subdistrict: p.subdistrict || '',
        district: p.district || '',
        province: p.province || 'กรุงเทพมหานคร',
        phone: p.phone || '',
        pronoun: p.pronoun || 'กระผม'
      }));
    }

    // 3. Users
    const { data: usersData, error: uErr } = await supabaseClient.from('app_users').select('*').order('created_at', { ascending: true });
    if (!uErr && usersData && usersData.length > 0) {
      state.users = usersData.map(u => ({
        id: u.id,
        username: u.username,
        password: u.password,
        name: u.name,
        role: u.role,
        personId: u.person_id || '',
        allowedPages: u.allowed_pages || ['dashboard', 'create', 'create-sick', 'create-personal', 'history'],
        isLocked: !!u.is_locked,
        createdAt: u.created_at
      }));
    }

    // 4. Leaves
    const { data: leavesData, error: lErr } = await supabaseClient.from('leaves').select('*').order('created_at', { ascending: false });
    if (!lErr && leavesData) {
      state.leaves = leavesData.map(l => ({
        id: l.id,
        personId: l.person_id || '',
        username: l.username,
        createdBy: l.created_by,
        name: l.name,
        position: l.position || '',
        leaveType: l.leave_type,
        formType: l.form_type,
        docDate: l.doc_date,
        startDate: l.start_date,
        endDate: l.end_date,
        days: l.days,
        province: l.province || '',
        contactAddress: l.contact_address || '',
        phone: l.phone || '',
        diagnosis: l.diagnosis || '',
        hospital: l.hospital || '',
        reason: l.reason || '',
        status: l.status || 'pending',
        discreteDates: l.discrete_dates || [],
        customDateText: l.custom_date_text || '',
        createdAt: l.created_at
      }));
    }

    // 5. Audit Logs
    const { data: logsData, error: aErr } = await supabaseClient.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200);
    if (!aErr && logsData && logsData.length > 0) {
      state.auditLogs = logsData.map(a => ({
        id: a.id,
        timestamp: a.timestamp,
        username: a.username,
        userName: a.user_name || a.username,
        role: a.role,
        action: a.action,
        actionTitle: a.action_title,
        category: a.category,
        details: a.details,
        ip: a.ip || '127.0.0.1 (Localhost)',
        status: a.status || 'info'
      }));
    }

    saveState();
    return { success: true, message: 'ดึงข้อมูลล่าสุดจาก Supabase Cloud เรียบร้อยแล้ว' };
  } catch (err) {
    console.error('Failed to pull from Supabase:', err);
    return { success: false, message: `เกิดข้อผิดพลาดในการดึงข้อมูล: ${err.message}` };
  }
}

/**
 * ส่งข้อมูลปัจจุบันในระบบขึ้น Supabase Cloud ทั้งหมด
 */
async function pushAllToSupabase() {
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient) {
    return { success: false, message: 'Supabase ยังไม่ได้ตั้งค่าหรือเชื่อมต่อ' };
  }

  try {
    // 1. Settings
    const s = state.settings;
    await supabaseClient.from('system_settings').upsert({
      id: 'default',
      system_title: s.systemTitle,
      system_subtitle: s.systemSubtitle,
      system_logo: s.systemLogo,
      unit_name: s.unitName,
      sub_org_name: s.subOrgName,
      written_at: s.writtenAt,
      default_to: s.defaultTo,
      endorse_to: s.endorseTo,
      endorse_rank: s.endorseRank,
      endorse_pos: s.endorsePos,
      endorse_pos2: s.endorsePos2 || '',
      order_rank: s.orderRank,
      order_pos1: s.orderPos1,
      order_pos2: s.orderPos2,
      stat_sign_name: s.statSignName,
      stat_sign_pos: s.statSignPos,
      updated_at: new Date().toISOString()
    });

    // 2. Personnel
    if (state.personnel && state.personnel.length > 0) {
      const pRows = state.personnel.map(p => ({
        id: p.id,
        rank: p.rank,
        name: p.name,
        position: p.position || '',
        position2: p.position2 || '',
        unit: p.unit || '',
        annual_quota: p.annualQuota ?? 10,
        acc_quota: p.accQuota ?? 0,
        sick_quota: p.sickQuota ?? 60,
        sick_taken: p.sickTaken ?? 0,
        home_no: p.homeNo || '',
        road: p.road || '',
        subdistrict: p.subdistrict || '',
        district: p.district || '',
        province: p.province || 'กรุงเทพมหานคร',
        phone: p.phone || '',
        pronoun: p.pronoun || 'กระผม',
        updated_at: new Date().toISOString()
      }));
      await supabaseClient.from('personnel').upsert(pRows);
    }

    // 3. Users
    if (state.users && state.users.length > 0) {
      const uRows = state.users.map(u => ({
        id: u.id,
        username: u.username,
        password: u.password,
        name: u.name,
        role: u.role,
        person_id: u.personId || null,
        allowed_pages: u.allowedPages || [],
        is_locked: !!u.isLocked,
        updated_at: new Date().toISOString()
      }));
      await supabaseClient.from('app_users').upsert(uRows);
    }

    // 4. Leaves
    if (state.leaves && state.leaves.length > 0) {
      const lRows = state.leaves.map(l => ({
        id: l.id,
        person_id: l.personId || null,
        username: l.username,
        created_by: l.createdBy || l.username,
        name: l.name,
        position: l.position || '',
        leave_type: l.leaveType,
        form_type: l.formType,
        doc_date: l.docDate ? l.docDate.substring(0, 10) : null,
        start_date: l.startDate ? l.startDate.substring(0, 10) : null,
        end_date: l.endDate ? l.endDate.substring(0, 10) : null,
        days: l.days || 1,
        province: l.province || '',
        contact_address: l.contactAddress || '',
        phone: l.phone || '',
        diagnosis: l.diagnosis || null,
        hospital: l.hospital || null,
        reason: l.reason || null,
        status: l.status || 'pending',
        discrete_dates: l.discreteDates || [],
        custom_date_text: l.customDateText || '',
        updated_at: new Date().toISOString()
      }));
      await supabaseClient.from('leaves').upsert(lRows);
    }

    return { success: true, message: 'ส่งข้อมูลทั้งหมดขึ้นสู่ฐานข้อมูล Supabase Cloud เรียบร้อยแล้ว' };
  } catch (err) {
    console.error('Failed to push to Supabase:', err);
    return { success: false, message: `เกิดข้อผิดพลาดในการอัปโหลดข้อมูล: ${err.message}` };
  }
}

/**
 * =============================================================================
 * AUTO-SYNC HELPERS (อัปโหลดข้อมูลทันทีเมื่อกดบันทึกหรือแก้ไขในแต่ละหน้า)
 * =============================================================================
 */

/**
 * ซิงค์การตั้งค่าระบบขึ้น Supabase Cloud ทันที
 */
async function syncSettingsToSupabase(s = (typeof state !== 'undefined' ? state.settings : null)) {
  if (!s) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    const row = {
      id: 'default',
      system_title: s.systemTitle || '',
      system_subtitle: s.systemSubtitle || '',
      system_logo: s.systemLogo || '📋',
      unit_name: s.unitName || '',
      sub_org_name: s.subOrgName || '',
      written_at: s.writtenAt || '',
      default_to: s.defaultTo || '',
      endorse_to: s.endorseTo || '',
      endorse_rank: s.endorseRank || '',
      endorse_pos: s.endorsePos || '',
      endorse_pos2: s.endorsePos2 || '',
      order_rank: s.orderRank || '',
      order_pos1: s.orderPos1 || '',
      order_pos2: s.orderPos2 || '',
      stat_sign_name: s.statSignName || '',
      stat_sign_pos: s.statSignPos || '',
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('system_settings').upsert(row);
    if (error) throw error;
    console.log('⚡ [Supabase] Settings synced successfully');
    return { success: true };
  } catch (err) {
    console.warn('⚠️ [Supabase] Failed to sync settings:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ซิงค์ข้อมูลกำลังพลรายบุคคลขึ้น Supabase Cloud ทันที
 */
async function syncPersonToSupabase(p) {
  if (!p || !p.id) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    const row = {
      id: p.id,
      rank: p.rank || '',
      name: p.name || '',
      position: p.position || '',
      position2: p.position2 || '',
      unit: p.unit || '',
      annual_quota: !isNaN(p.annualQuota) ? p.annualQuota : 10,
      acc_quota: !isNaN(p.accQuota) ? p.accQuota : 0,
      sick_quota: !isNaN(p.sickQuota) ? p.sickQuota : 60,
      sick_taken: !isNaN(p.sickTaken) ? p.sickTaken : 0,
      home_no: p.homeNo || '',
      road: p.road || '',
      subdistrict: p.subdistrict || '',
      district: p.district || '',
      province: p.province || 'กรุงเทพมหานคร',
      phone: p.phone || '',
      pronoun: p.pronoun || 'กระผม',
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('personnel').upsert(row);
    if (error) throw error;
    console.log(`⚡ [Supabase] Person ${p.name} synced successfully`);
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to sync person ${p.name || p.id}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ลบข้อมูลกำลังพลออกจาก Supabase Cloud ทันที
 */
async function deletePersonFromSupabase(personId) {
  if (!personId) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    const { error } = await supabaseClient.from('personnel').delete().eq('id', personId);
    if (error) throw error;
    console.log(`⚡ [Supabase] Person ${personId} deleted successfully`);
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to delete person ${personId}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ซิงค์รายการใบลาขึ้น Supabase Cloud ทันที
 */
async function syncLeaveToSupabase(l) {
  if (!l || !l.id) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    // If leave has a personId, ensure the person is synced to Supabase first to satisfy FK constraint
    if (l.personId && typeof state !== 'undefined' && Array.isArray(state.personnel)) {
      const p = state.personnel.find(item => item.id === l.personId);
      if (p) {
        await syncPersonToSupabase(p);
      }
    }

    const row = {
      id: l.id,
      person_id: l.personId || null,
      username: l.username || (typeof state !== 'undefined' && state.currentUser ? state.currentUser.username : 'user'),
      created_by: l.createdBy || l.username || (typeof state !== 'undefined' && state.currentUser ? state.currentUser.username : 'user'),
      name: l.name || '',
      position: l.position || '',
      leave_type: l.leaveType || 'vacation',
      form_type: l.formType || 'แบบ ๗',
      doc_date: l.docDate ? l.docDate.substring(0, 10) : null,
      start_date: l.startDate ? l.startDate.substring(0, 10) : null,
      end_date: l.endDate ? l.endDate.substring(0, 10) : null,
      days: parseInt(l.days, 10) || 1,
      province: l.province || '',
      contact_address: l.contactAddress || (l.homeNo ? `${l.homeNo} ${l.road || ''} ${l.subdistrict || ''} ${l.district || ''} ${l.province || ''}`.trim() : ''),
      phone: l.phone || '',
      diagnosis: l.diagnosis || null,
      hospital: l.hospital || null,
      reason: l.reason || null,
      status: l.status || 'pending',
      discrete_dates: Array.isArray(l.discreteDates) ? l.discreteDates : [],
      custom_date_text: l.customDateText || '',
      updated_at: new Date().toISOString()
    };

    let { error } = await supabaseClient.from('leaves').upsert(row);
    if (error && error.message && error.message.includes('foreign key constraint')) {
      row.person_id = null;
      const retry = await supabaseClient.from('leaves').upsert(row);
      error = retry.error;
    }
    if (error) throw error;
    console.log(`⚡ [Supabase] Leave ${l.id} synced successfully`);
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to sync leave ${l.id}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ลบรายการใบลาออกจาก Supabase Cloud ทันที
 */
async function deleteLeaveFromSupabase(leaveId) {
  if (!leaveId) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    const { error } = await supabaseClient.from('leaves').delete().eq('id', leaveId);
    if (error) throw error;
    console.log(`⚡ [Supabase] Leave ${leaveId} deleted successfully`);
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to delete leave ${leaveId}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ซิงค์บัญชีผู้ใช้งานขึ้น Supabase Cloud ทันที
 */
async function syncUserToSupabase(u) {
  if (!u || !u.id) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    if (u.personId && typeof state !== 'undefined' && Array.isArray(state.personnel)) {
      const p = state.personnel.find(item => item.id === u.personId);
      if (p) {
        await syncPersonToSupabase(p);
      }
    }

    const row = {
      id: u.id,
      username: u.username,
      password: u.password,
      name: u.name || u.username,
      role: u.role || 'user',
      person_id: u.personId || null,
      allowed_pages: Array.isArray(u.allowedPages) ? u.allowedPages : [],
      is_locked: !!u.isLocked,
      updated_at: new Date().toISOString()
    };

    let { error } = await supabaseClient.from('app_users').upsert(row);
    if (error && error.message && error.message.includes('foreign key constraint')) {
      row.person_id = null;
      const retry = await supabaseClient.from('app_users').upsert(row);
      error = retry.error;
    }
    if (error) throw error;
    console.log(`⚡ [Supabase] User ${u.username} synced successfully`);
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to sync user ${u.username}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ลบบัญชีผู้ใช้งานออกจาก Supabase Cloud ทันที
 */
async function deleteUserFromSupabase(userId) {
  if (!userId) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    const { error } = await supabaseClient.from('app_users').delete().eq('id', userId);
    if (error) throw error;
    console.log(`⚡ [Supabase] User ${userId} deleted successfully`);
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to delete user ${userId}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * ซิงค์ประวัติกิจกรรม (Audit Log) ขึ้น Supabase Cloud ทันที
 */
async function syncAuditLogToSupabase(log) {
  if (!log || !log.id) return { success: false, skipped: true };
  if (!supabaseClient) initSupabaseClient();
  if (!supabaseClient || !isSupabaseConfigured()) return { success: false, skipped: true };

  try {
    const row = {
      id: log.id,
      timestamp: log.timestamp || new Date().toISOString(),
      username: log.username || 'system',
      user_name: log.userName || log.username || 'ระบบส่วนกลาง',
      role: log.role || 'system',
      action: log.action || 'ACTION',
      action_title: log.actionTitle || 'กิจกรรม',
      category: log.category || 'general',
      details: log.details || '',
      ip: log.ip || '127.0.0.1 (Localhost)',
      status: log.status || 'info'
    };
    const { error } = await supabaseClient.from('audit_logs').upsert(row);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn(`⚠️ [Supabase] Failed to sync audit log ${log.id}:`, err.message);
    return { success: false, error: err.message };
  }
}

// Global window bindings for cross-script invocation
if (typeof window !== 'undefined') {
  window.initSupabaseClient = initSupabaseClient;
  window.isSupabaseConfigured = isSupabaseConfigured;
  window.getSupabaseConfig = getSupabaseConfig;
  window.saveSupabaseConfig = saveSupabaseConfig;
  window.testSupabaseConnection = testSupabaseConnection;
  window.pushAllToSupabase = pushAllToSupabase;
  window.pullFromSupabase = pullFromSupabase;
  window.syncSettingsToSupabase = syncSettingsToSupabase;
  window.syncPersonToSupabase = syncPersonToSupabase;
  window.deletePersonFromSupabase = deletePersonFromSupabase;
  window.syncLeaveToSupabase = syncLeaveToSupabase;
  window.deleteLeaveFromSupabase = deleteLeaveFromSupabase;
  window.syncUserToSupabase = syncUserToSupabase;
  window.deleteUserFromSupabase = deleteUserFromSupabase;
  window.syncAuditLogToSupabase = syncAuditLogToSupabase;

  window.addEventListener('DOMContentLoaded', () => {
    initSupabaseClient();
  });
}
