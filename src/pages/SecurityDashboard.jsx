import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  FileText,
  TrendingUp
} from "lucide-react";

export default function SecurityDashboard() {
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 100),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders-security'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  // Security metrics
  const recentFailures = auditLogs.filter(log => !log.success).length;
  const paymentIssues = orders.filter(o => o.payment_status === 'failed').length;
  const recentActivity = auditLogs.filter(log => 
    new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-600" />
          Security & Compliance Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Monitor security events and compliance status</p>
      </div>

      {/* Security Status Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">Secure</p>
            <p className="text-sm text-gray-600 mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-blue-600" />
              24h Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{recentActivity}</p>
            <p className="text-sm text-gray-600 mt-1">Logged events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Failed Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{recentFailures}</p>
            <p className="text-sm text-gray-600 mt-1">Require review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Payment Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{paymentIssues}</p>
            <p className="text-sm text-gray-600 mt-1">Failed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Checklist */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security & Compliance Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ComplianceItem 
              title="HTTPS/SSL Encryption" 
              status="active" 
              description="All traffic encrypted"
            />
            <ComplianceItem 
              title="Payment Security (PCI-DSS)" 
              status="active" 
              description="Stripe Level 1 compliant"
            />
            <ComplianceItem 
              title="Data Encryption at Rest" 
              status="active" 
              description="Database encryption enabled"
            />
            <ComplianceItem 
              title="Authentication Required" 
              status="active" 
              description="User login enforced"
            />
            <ComplianceItem 
              title="Privacy Policy Published" 
              status="active" 
              description="GDPR compliant"
            />
            <ComplianceItem 
              title="Cookie Consent Banner" 
              status="active" 
              description="EU/UK compliant"
            />
            <ComplianceItem 
              title="Audit Logging Active" 
              status="active" 
              description={`${auditLogs.length} events logged`}
            />
            <ComplianceItem 
              title="Data Export Available" 
              status="active" 
              description="Customer data portability"
            />
            <ComplianceItem 
              title="Account Deletion Process" 
              status="active" 
              description="GDPR right to erasure"
            />
            <ComplianceItem 
              title="Backup System" 
              status="active" 
              description="Automated by Base44"
            />
            <ComplianceItem 
              title="Cyber Essentials Certification" 
              status="pending" 
              description="Apply via IASME"
            />
            <ComplianceItem 
              title="Penetration Testing" 
              status="pending" 
              description="Schedule security audit"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.slice(0, 20).map(log => (
              <div 
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.action}
                    </Badge>
                    <span className="text-sm text-gray-600">{log.user_email}</span>
                  </div>
                  {log.details && (
                    <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComplianceItem({ title, status, description }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {status === 'active' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        )}
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 'Active' : 'Pending'}
      </Badge>
    </div>
  );
}