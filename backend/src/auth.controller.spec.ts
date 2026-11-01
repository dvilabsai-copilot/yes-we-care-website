import { AuthController } from './auth.controller';

describe('AuthController password management', () => {
  it('changes the authenticated admin password after verifying the current password', async () => {
    const prisma = {
      adminUser: {
        findUnique: jest.fn().mockResolvedValue({ id: 'admin-1', email: 'admin@ywc.com', passwordHash: '$2b$04$4P8o4Qh1QhLkZ8G8YjTq0eQpM9E8W0V9r9V9o2Xc9W9r9Y4W9S9mS', isActive: true }),
        update: jest.fn().mockResolvedValue({ id: 'admin-1' })
      }
    } as any;
    const jwt = { signAsync: jest.fn() } as any;
    const controller = new AuthController(prisma, jwt);
    const bcrypt = await import('bcryptjs');
    prisma.adminUser.findUnique.mockResolvedValue({ id: 'admin-1', email: 'admin@ywc.com', passwordHash: await bcrypt.hash('admin123', 4), isActive: true });
    await expect(controller.changePassword({ user: { sub: 'admin-1', email: 'admin@ywc.com', role: 'ADMIN' } } as any, { currentPassword: 'admin123', newPassword: 'newpass123' })).resolves.toEqual({ ok: true });
    expect(prisma.adminUser.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'admin-1' }, data: { passwordHash: expect.any(String) } }));
  });
});
