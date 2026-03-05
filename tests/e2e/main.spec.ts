import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('User can sign up and log in securely', async ({ page }) => {
    // Navigate to signup page
    await page.goto('http://localhost:3000/signup');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123');
    await page.click('button[type="submit"]');
    
    // Assert user is redirected to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    
    // Logout
    await page.click('text=Logout');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123');
    await page.click('button[type="submit"]');
    
    // Assert user is redirected to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  test('User receives error message for invalid login attempts', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'invaliduser@example.com');
    await page.fill('input[name="password"]', 'WrongPassword');
    await page.click('button[type="submit"]');
    
    // Assert error message is displayed
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });
});

test.describe('Create Visual Workflow', () => {
  test('User can create a visual workflow for AI agents', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Open workflow builder
    await page.click('text=Create Workflow');
    
    // Drag and drop tasks
    await page.dragAndDrop('text=Task 1', 'div#workflow-builder');
    await page.dragAndDrop('text=Task 2', 'div#workflow-builder');
    
    // Connect tasks
    await page.click('text=Task 1');
    await page.click('text=Connect to Task 2');
    
    // Save and name the workflow
    await page.fill('input[name="workflowName"]', 'My First Workflow');
    await page.click('button[type="submit"]');
    
    // Assert success message
    await expect(page.locator('text=Workflow saved successfully')).toBeVisible();
  });
});

test.describe('Automated Task Scheduling', () => {
  test('User can automate scheduling for AI agents', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Navigate to scheduling section
    await page.click('text=Task Scheduling');
    
    // Set up task details
    await page.fill('input[name="taskName"]', 'Task A');
    await page.fill('input[name="deadline"]', '2023-12-31');
    await page.selectOption('select[name="priority"]', 'High');
    await page.click('button[type="submit"]');
    
    // Assert schedule generation
    await expect(page.locator('text=Schedule generated successfully')).toBeVisible();
  });
});

test.describe('Integrate with AI Tools', () => {
  test('User can integrate AgentFlow with AI tools', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Connect TensorFlow account
    await page.click('text=Integrations');
    await page.fill('input[name="tensorflowAccount"]', 'tensorflow_user');
    await page.click('button[type="submit"]');

    // Assert TensorFlow connection success
    await expect(page.locator('text=Connected to TensorFlow')).toBeVisible();

    // Connect OpenAI API account
    await page.fill('input[name="openAIAccount"]', 'openai_user');
    await page.click('button[type="submit"]');

    // Assert OpenAI connection success
    await expect(page.locator('text=Connected to OpenAI API')).toBeVisible();
  });
});

test.describe('Receive Real-Time Notifications', () => {
  test('User receives notifications for agent statuses', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Assume there are notifications already setup in the system
    await page.click('text=Notifications');
    
    // Assert that user receives notifications
    await expect(page.locator('text=Task A completed')).toBeVisible();
    await expect(page.locator('text=Task B encountered an error')).toBeVisible();
  });
});

test.describe('User-Friendly Dashboard', () => {
  test('Dashboard displays a list of all agents with current statuses', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Assert dashboard displays agents
    await expect(page.locator('text=Agent 1')).toBeVisible();
    await expect(page.locator('text=Agent 2')).toBeVisible();
    
    // Click on an agent for detailed view
    await page.click('text=Agent 1');
    
    // Assert detailed view is displayed
    await expect(page).toHaveURL(/\/agent\/1$/);
  });
});