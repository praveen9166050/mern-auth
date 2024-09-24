import { Check, X } from "lucide-react";

function PasswordCriteria({password}) {
  const criteria = [
		{ label: "At least 6 characters", met: password.length >= 6 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((criterion) => (
        <div key={criterion.label} className="flex items-center text-xs">
          {criterion.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={criterion.met ? "text-green-500" : "text-gray-400"}>
            {criterion.label}
          </span>
        </div>
      ))}
    </div>
  );
}
function PasswordStrengthMeter({password}) {
  const getStrength = (password) => {
		let strength = 0;
		if (password.length >= 6) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/\d/)) strength++;
		if (password.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};
	const strength = getStrength(password);

	const getColor = (strength) => {
		if (strength === 0) return "bg-red-500";
		if (strength === 1) return "bg-red-400";
		if (strength === 2) return "bg-yellow-500";
		if (strength === 3) return "bg-yellow-400";
		return "bg-green-500";
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Very Weak";
		if (strength === 1) return "Weak";
		if (strength === 2) return "Fair";
		if (strength === 3) return "Good";
		return "Strong";
	};
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password Strength</span>
        <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
      </div>
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className={`
              h-1 w-1/4 rounded-full transition-colors duration-300 
              ${index < strength ? getColor(strength) : "bg-gray-600"}
            `}
          >

          </div>
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  )
}

export default PasswordStrengthMeter;